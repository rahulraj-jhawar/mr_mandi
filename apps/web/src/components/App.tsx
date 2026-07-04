'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import {
  BROKERS,
  FLOWS,
  type Broker,
  type HubKind,
  type Trade,
  TRADES,
  poolTotal,
  totals,
} from '../data/labour';
import type { FlyTarget } from './MapView';
import DetailPanel from './DetailPanel';
import RequestModal from './RequestModal';
import { ArrowRight, MapPin, Plus, Search, ShieldCheck, Sliders, Star, Users } from './icons';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <div className="spinner" />
    </div>
  ),
});

const KINDS: { key: HubKind; label: string; color: string }[] = [
  { key: 'source', label: 'Source', color: 'var(--source)' },
  { key: 'demand', label: 'Demand', color: 'var(--demand)' },
  { key: 'balanced', label: 'Balanced', color: 'var(--balanced)' },
];

const fmt = (n: number) => n.toLocaleString('en-IN');
const fmtCompact = (n: number) =>
  n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;

const brokerIndex: Record<string, Broker> = Object.fromEntries(BROKERS.map((b) => [b.id, b]));
const T = totals();

export default function App() {
  const [query, setQuery] = useState('');
  const [kinds, setKinds] = useState<Set<HubKind>>(new Set(['source', 'demand', 'balanced']));
  const [trades, setTrades] = useState<Set<Trade>>(new Set());
  const [showFlows, setShowFlows] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fly, setFly] = useState<FlyTarget | null>(null);
  const [modal, setModal] = useState<{ open: boolean; broker: Broker | null }>({
    open: false,
    broker: null,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BROKERS.filter((b) => {
      if (!kinds.has(b.kind)) return false;
      if (trades.size > 0 && !b.trades.some((t) => trades.has(t))) return false;
      if (q) {
        const hay = `${b.name} ${b.city} ${b.state} ${b.trades.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, kinds, trades]);

  const visibleIds = useMemo(() => new Set(filtered.map((b) => b.id)), [filtered]);
  const visibleFlows = useMemo(
    () => FLOWS.filter((f) => visibleIds.has(f.from) && visibleIds.has(f.to)),
    [visibleIds],
  );

  const selected = selectedId ? brokerIndex[selectedId] : null;

  const select = (id: string) => {
    const b = brokerIndex[id];
    if (!b) return;
    setSelectedId(id);
    setFly({ lat: b.lat, lng: b.lng, zoom: 9, key: Date.now() });
  };

  const toggleKind = (k: HubKind) => {
    setKinds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next.size === 0 ? new Set(['source', 'demand', 'balanced']) : next;
    });
  };

  const toggleTrade = (t: Trade) => {
    setTrades((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filtered[0]) select(filtered[0].id);
  };

  return (
    <div className="app">
      <div className="map-root">
        <MapView
          brokers={filtered}
          flows={visibleFlows}
          brokerIndex={brokerIndex}
          selectedId={selectedId}
          showFlows={showFlows}
          onSelect={select}
          fly={fly}
        />
      </div>

      {/* Top bar */}
      <div className="topbar">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/logo-mark.png" alt="Mistri Mandi" width={32} height={32} />
          <span className="brand-name">
            Mistri&nbsp;Mandi <span>{'// Labour Chowk'}</span>
          </span>
        </div>

        <form className="search" onSubmit={onSearchSubmit}>
          <Search width={17} height={17} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, state, trade or broker…"
          />
        </form>

        <div className="topbar-spacer" />

        <button className="btn btn-primary" onClick={() => setModal({ open: true, broker: null })}>
          <Plus width={16} height={16} />
          Post a requirement
        </button>
      </div>

      {/* Left filter rail */}
      <div className="filters">
        <div className="card card-pad">
          <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sliders width={13} height={13} /> Hub type
          </div>
          <div className="chip-row">
            {KINDS.map((k) => (
              <button
                key={k.key}
                className={`chip ${kinds.has(k.key) ? 'active' : ''}`}
                onClick={() => toggleKind(k.key)}
              >
                <span className="dot" style={{ background: k.color }} />
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="filter-title">Trade</div>
          <div className="chip-row">
            {TRADES.map((t) => (
              <button
                key={t}
                className={`chip ${trades.has(t) ? 'active' : ''}`}
                onClick={() => toggleTrade(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <button
            className="checkrow"
            style={{ marginBottom: 12 }}
            onClick={() => setShowFlows((s) => !s)}
            aria-pressed={showFlows}
          >
            <span className={`checkbox ${showFlows ? 'on' : ''}`} />
            <span>
              <span className="ck-label">Show predictable labour flow</span>
              <span className="ck-sub">Overlay seasonal source → demand corridors</span>
            </span>
          </button>
          <div className="legend-item">
            <span className="legend-swatch" style={{ background: 'var(--source)' }} /> Surplus —
            source here
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ background: 'var(--demand)' }} /> Deficit —
            builder demand
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ background: 'var(--balanced)' }} /> Balanced hub
          </div>
          <div className="legend-item">
            <span className="legend-line" /> Predicted monthly flow
          </div>
        </div>
      </div>

      {/* Bottom-left stats */}
      <div className="stats">
        <div className="stat">
          <div className="stat-num">{T.brokers}</div>
          <div className="stat-label">Broker hubs</div>
        </div>
        <div className="stat">
          <div className="stat-num">{T.states}</div>
          <div className="stat-label">States</div>
        </div>
        <div className="stat">
          <div className="stat-num">{fmtCompact(T.workers)}</div>
          <div className="stat-label">Workers mapped</div>
        </div>
        <div className="stat">
          <div className="stat-num">{fmtCompact(T.movement)}/mo</div>
          <div className="stat-label">Predicted flow</div>
        </div>
      </div>

      {/* Right: detail panel OR result list */}
      {selected ? (
        <DetailPanel
          broker={selected}
          flows={FLOWS}
          brokerIndex={brokerIndex}
          onClose={() => setSelectedId(null)}
          onRequest={(b) => setModal({ open: true, broker: b })}
          onJumpTo={select}
        />
      ) : (
        <div className="results card">
          <div className="results-head">
            <h2>Labour brokers</h2>
            <span className="count">{filtered.length} shown</span>
          </div>
          <div className="results-scroll">
            {filtered.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                No hubs match these filters.
              </div>
            )}
            {filtered.map((b) => (
              <button key={b.id} className="broker-row" onClick={() => select(b.id)}>
                <div className="broker-row-head">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="row-avatar" src={b.photo} alt={b.name} loading="lazy" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="broker-name">{b.name}</div>
                    <div className="broker-loc" style={{ marginTop: 2 }}>
                      <MapPin width={12} height={12} />
                      {b.city}, {b.state}
                    </div>
                  </div>
                  <span className="rank-badge">#{b.rank}</span>
                </div>
                <div className="broker-row-top" style={{ marginTop: 9 }}>
                  <span className={`kind-tag kind-${b.kind}`}>{b.kind}</span>
                  {b.verified && (
                    <span className="verified-badge">
                      <ShieldCheck width={12} height={12} /> Verified
                    </span>
                  )}
                  <span
                    style={{
                      marginLeft: 'auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <Star width={13} height={13} style={{ color: '#f59e0b' }} />
                    {b.rating.toFixed(1)}
                  </span>
                </div>
                <div className="broker-row-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Users width={13} height={13} style={{ color: 'var(--muted)' }} />
                    <b>{fmt(poolTotal(b.pool))}</b> workers
                  </span>
                  <span>
                    ₹{b.dayRate[0]}–{b.dayRate[1]}/day
                  </span>
                  <ArrowRight
                    width={14}
                    height={14}
                    style={{ marginLeft: 'auto', color: 'var(--muted)' }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {modal.open && (
        <RequestModal broker={modal.broker} onClose={() => setModal({ open: false, broker: null })} />
      )}
    </div>
  );
}
