'use client';

import { useState } from 'react';
import { type Broker, TRADES } from '../data/labour';
import { Check, Close } from './icons';

interface Props {
  broker: Broker | null; // null = general "post a requirement"
  onClose: () => void;
}

export default function RequestModal({ broker, onClose }: Props) {
  const [sent, setSent] = useState(false);
  const [trade, setTrade] = useState<string>(broker?.trades[0] ?? TRADES[0]);
  const isDemand = broker?.kind === 'demand';
  const title = broker
    ? isDemand
      ? `Post a requirement in ${broker.city}`
      : `Request sourcing from ${broker.name}`
    : 'Post a labour requirement';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <div className="modal-success">
            <div className="success-ring">
              <Check width={30} height={30} />
            </div>
            <h2>Request received</h2>
            <p>
              We’ll match you with verified sourcing partners
              {broker ? ` around ${broker.city}` : ' along the right labour corridor'} and reach out
              within one working day.
            </p>
            <div style={{ marginTop: 22 }}>
              <button className="btn btn-primary" onClick={onClose} style={{ boxShadow: 'none' }}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="modal-head" style={{ position: 'relative' }}>
              <button
                type="button"
                className="detail-close"
                onClick={onClose}
                aria-label="Close"
                style={{ position: 'absolute', top: 16, right: 16 }}
              >
                <Close width={16} height={16} />
              </button>
              <h2>{title}</h2>
              <p>
                Tell us what you need on site. We map it against predicted labour flows and connect
                you with the closest verified brokers.
              </p>
            </div>

            <div className="modal-body">
              <div className="field">
                <label>Project / company name</label>
                <input required placeholder="e.g. Skyline Towers, Phase 2" />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Trade needed</label>
                  <select value={trade} onChange={(e) => setTrade(e.target.value)}>
                    {TRADES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Workers required</label>
                  <input required type="number" min={1} defaultValue={25} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Skill level</label>
                  <select defaultValue="Skilled">
                    <option>Skilled</option>
                    <option>Semi-skilled</option>
                    <option>Unskilled</option>
                    <option>Mixed crew</option>
                  </select>
                </div>
                <div className="field">
                  <label>Site city</label>
                  <input required defaultValue={isDemand ? broker?.city : ''} placeholder="e.g. Pune" />
                </div>
              </div>
              <div className="field">
                <label>Contact number</label>
                <input required type="tel" placeholder="+91 ••••• •••••" />
              </div>
            </div>

            <div className="modal-foot">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Find sourcing partners
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
