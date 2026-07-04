'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { BROKERS, FLOWS, type Broker, poolTotal } from '../data/labour';
import type { FlyTarget } from './MapView';
import { ArrowRight, Expand, MapPin, ShieldCheck, Star, Users } from './icons';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="map-loading" style={{ position: 'absolute' }}>
      <div className="spinner" />
    </div>
  ),
});

const brokerIndex: Record<string, Broker> = Object.fromEntries(BROKERS.map((b) => [b.id, b]));
const fmt = (n: number) => n.toLocaleString('en-IN');

// A compact, on-brand preview of Labour Chowk for the landing page:
// the broker map with seasonal flows on by default + an agent list, expandable
// into the full experience.
export default function ChowkPreview() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fly, setFly] = useState<FlyTarget | null>(null);

  const select = (id: string) => {
    const b = brokerIndex[id];
    if (!b) return;
    setSelectedId(id);
    setFly({ lat: b.lat, lng: b.lng, zoom: 8, key: Date.now() });
  };

  return (
    <div className="chowk-preview">
      <div className="chowk-map">
        <MapView
          brokers={BROKERS}
          flows={FLOWS}
          brokerIndex={brokerIndex}
          selectedId={selectedId}
          showFlows
          onSelect={select}
          fly={fly}
          zoomControl
          scrollWheelZoom={false}
        />
        <div className="mig-legend">
          <span>
            <i style={{ background: '#e11d48' }} /> Sends workers
          </span>
          <span>
            <i style={{ background: '#16a34a' }} /> Receives workers
          </span>
          <span>
            <i className="ln" /> Seasonal flow
          </span>
        </div>
        <Link href="/labour-chowk" className="chowk-expand" aria-label="Expand to Labour Chowk">
          <Expand width={16} height={16} /> Expand
        </Link>
      </div>

      <aside className="chowk-agents card">
        <div className="chowk-agents-head">
          <h3>Labour agents</h3>
          <span className="count">{BROKERS.length} verified</span>
        </div>
        <div className="chowk-agents-list">
          {BROKERS.map((b) => (
            <button
              key={b.id}
              className={`agent-row ${selectedId === b.id ? 'selected' : ''}`}
              onClick={() => select(b.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="row-avatar" src={b.photo} alt={b.name} loading="lazy" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="agent-name">
                  {b.name}
                  {b.verified && <ShieldCheck width={12} height={12} className="agent-tick" />}
                </div>
                <div className="broker-loc" style={{ marginTop: 1 }}>
                  <MapPin width={12} height={12} />
                  {b.city}, {b.state}
                </div>
                <div className="agent-metrics">
                  <span>
                    <Users width={12} height={12} /> {fmt(poolTotal(b.pool))}
                  </span>
                  <span>
                    <Star width={12} height={12} style={{ color: '#f59e0b' }} /> {b.rating.toFixed(1)}
                  </span>
                  <span>{b.fulfilmentRate}% filled</span>
                </div>
              </div>
              <span className="rank-badge">#{b.rank}</span>
            </button>
          ))}
        </div>
        <Link href="/labour-chowk" className="chowk-open-all">
          Open Labour Chowk <ArrowRight width={16} height={16} />
        </Link>
      </aside>
    </div>
  );
}
