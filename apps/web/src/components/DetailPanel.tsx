'use client';

import { type Broker, type Flow, poolTotal, reviewsFor } from '../data/labour';
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

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

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
  const reviews = reviewsFor(broker);

  return (
    <div className="detail card">
      <div className="detail-head">
        <button className="detail-close" onClick={onClose} aria-label="Close">
          <Close width={16} height={16} />
        </button>
        <div className="detail-profile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="detail-avatar" src={broker.photo} alt={broker.name} />
          <div style={{ minWidth: 0 }}>
            <div className="detail-name" style={{ margin: '0 0 4px', paddingRight: 30 }}>
              {broker.name}
            </div>
            <div className="detail-loc">
              <MapPin width={14} height={14} />
              {broker.city}, {broker.state}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <span className={`kind-tag kind-${broker.kind}`}>{kindLabel[broker.kind]}</span>
              {broker.verified && (
                <span className="verified-badge">
                  <ShieldCheck width={13} height={13} /> Verified
                </span>
              )}
              <span className="rank-chip">
                <Star width={11} height={11} /> #{broker.rank} nationally
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div>
          <div className="detail-section-title">Sourcing metrics</div>
          <div className="metric-grid">
            <div className="metric">
              <div className="metric-n">{fmt(broker.placements)}</div>
              <div className="metric-l">Workers placed</div>
            </div>
            <div className="metric">
              <div className="metric-n">{broker.fulfilmentRate}%</div>
              <div className="metric-l">Fulfilment rate</div>
            </div>
            <div className="metric">
              <div className="metric-n">{broker.mobilizationDays} days</div>
              <div className="metric-l">Avg. mobilization</div>
            </div>
            <div className="metric">
              <div className="metric-n">{broker.repeatRate}%</div>
              <div className="metric-l">Repeat clients</div>
            </div>
          </div>
        </div>

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
              <span style={{ color: 'var(--muted)', fontWeight: 500 }}>
                ({fmt(broker.reviewsCount)})
              </span>
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

        <div>
          <div className="detail-section-title">Reviews · {fmt(broker.reviewsCount)}</div>
          {reviews.map((rv, i) => (
            <div className="review" key={i}>
              <div className="review-top">
                <span className="review-av">{initials(rv.author)}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="review-who">{rv.author}</div>
                  <div className="review-role">{rv.role}</div>
                </div>
                <span className="review-stars">
                  {Array.from({ length: rv.rating }).map((_, s) => (
                    <Star key={s} width={11} height={11} />
                  ))}
                </span>
              </div>
              <div className="review-text">{rv.text}</div>
            </div>
          ))}
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
