'use client';

import { type Broker, type Flow, poolTotal } from '../data/labour';
import {
  ArrowRight,
  Check,
  Close,
  Flow as FlowIcon,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from './icons';

const kindLabel: Record<Broker['kind'], string> = {
  source: 'Labour surplus · source here',
  demand: 'Labour deficit · builder demand',
  balanced: 'Balanced hub',
};

const fmt = (n: number) => n.toLocaleString('en-IN');

interface Props {
  broker: Broker;
  flows: Flow[];
  brokerIndex: Record<string, Broker>;
  onClose: () => void;
  onRequest: (b: Broker) => void;
  onJumpTo: (id: string) => void;
}

export default function DetailPanel({
  broker,
  flows,
  brokerIndex,
  onClose,
  onRequest,
  onJumpTo,
}: Props) {
  const total = poolTotal(broker.pool);
  const pct = (n: number) => `${(n / total) * 100}%`;
  const related = flows.filter((f) => f.from === broker.id || f.to === broker.id);

  return (
    <div className="detail card">
      <div className="detail-head">
        <span className={`kind-tag kind-${broker.kind}`}>{kindLabel[broker.kind]}</span>
        <button className="detail-close" onClick={onClose} aria-label="Close">
          <Close width={16} height={16} />
        </button>
        <div className="detail-name">{broker.name}</div>
        <div className="detail-loc">
          <MapPin width={14} height={14} />
          {broker.city}, {broker.state}
          {broker.verified && (
            <span className="verified-badge" style={{ marginLeft: 6 }}>
              <ShieldCheck width={13} height={13} /> Verified
            </span>
          )}
        </div>
      </div>

      <div className="detail-body">
        <div className="note-box">
          <FlowIcon width={16} height={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{broker.note}</span>
        </div>

        <div>
          <div className="detail-section-title">Worker pool · {fmt(total)} mapped</div>
          <div className="pool-grid">
            <div className="pool-cell">
              <div className="pool-num">{fmt(broker.pool.skilled)}</div>
              <div className="pool-lbl">Skilled</div>
            </div>
            <div className="pool-cell">
              <div className="pool-num">{fmt(broker.pool.semiSkilled)}</div>
              <div className="pool-lbl">Semi-skilled</div>
            </div>
            <div className="pool-cell">
              <div className="pool-num">{fmt(broker.pool.unskilled)}</div>
              <div className="pool-lbl">Unskilled</div>
            </div>
          </div>
          <div className="bar">
            <span style={{ width: pct(broker.pool.skilled), background: '#2563eb' }} />
            <span style={{ width: pct(broker.pool.semiSkilled), background: '#60a5fa' }} />
            <span style={{ width: pct(broker.pool.unskilled), background: '#bfdbfe' }} />
          </div>
        </div>

        <div>
          <div className="detail-section-title">Trades available</div>
          <div className="trade-tags">
            {broker.trades.map((t) => (
              <span key={t} className="trade-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="detail-section-title">Details</div>
          <div className="kv">
            <span className="kv-k">Day-rate range</span>
            <span className="kv-v">
              ₹{broker.dayRate[0]}–₹{broker.dayRate[1]}
            </span>
          </div>
          <div className="kv">
            <span className="kv-k">Rating</span>
            <span className="kv-v" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Star width={14} height={14} style={{ color: '#f59e0b' }} />
              {broker.rating.toFixed(1)}
            </span>
          </div>
          <div className="kv">
            <span className="kv-k">Sourcing partner since</span>
            <span className="kv-v">{broker.since}</span>
          </div>
          <div className="kv">
            <span className="kv-k">Contact</span>
            <span className="kv-v" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Phone width={13} height={13} style={{ color: 'var(--muted)' }} />
              {broker.contact}
            </span>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <div className="detail-section-title">Predicted flows</div>
            {related.map((f) => {
              const other = f.from === broker.id ? brokerIndex[f.to] : brokerIndex[f.from];
              const outbound = f.from === broker.id;
              if (!other) return null;
              return (
                <button
                  key={`${f.from}-${f.to}`}
                  className="flow-row"
                  style={{ width: '100%', textAlign: 'left', background: 'none' }}
                  onClick={() => onJumpTo(other.id)}
                >
                  <span className="flow-arrow">
                    {outbound ? 'To' : 'From'} {other.city}
                    <ArrowRight width={13} height={13} style={{ color: 'var(--muted)' }} />
                    <b>{fmt(f.workers)}</b>
                  </span>
                  <span className={`trend trend-${f.trend}`}>{f.trend}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="detail-foot">
        <button className="btn btn-ghost" onClick={onClose}>
          Back to map
        </button>
        <button className="btn btn-primary" onClick={() => onRequest(broker)}>
          <Check width={15} height={15} />
          {broker.kind === 'demand' ? 'Post requirement' : 'Request sourcing'}
        </button>
      </div>
    </div>
  );
}
