'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  MONTHS,
  MONTHS_SHORT,
  MONTH_NOTE,
  SEASONALITY,
  monthlyMoversLakh,
} from '../data/migration';

const MigrationMap = dynamic(() => import('./MigrationMap'), {
  ssr: false,
  loading: () => (
    <div className="map-loading" style={{ position: 'absolute' }}>
      <div className="spinner" />
    </div>
  ),
});

const CURRENT_MONTH = new Date().getMonth();

// The interactive month-filterable flow map, shared across pages.
export default function SeasonalMapSection() {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const isCurrent = month === CURRENT_MONTH;

  return (
    <div className="mig">
      <div className="mig-map">
        <MigrationMap month={month} />
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
      </div>

      <aside className="mig-side">
        <div className="mig-readout">
          <div className="mig-month">
            {MONTHS[month]}
            {isCurrent && <span className="now">now</span>}
          </div>
          <div className="mig-figure">
            ~{monthlyMoversLakh(month).toFixed(1)}
            <small> lakh / month</small>
          </div>
          <div className="mig-sub">
            est. inter-state movers · seasonal average vs {(SEASONALITY[month] * 100).toFixed(0)}% of
            the yearly norm
          </div>
          <p className="mig-note">{MONTH_NOTE[month]}</p>
        </div>

        <div className="mig-picker">
          <div className="mig-picker-label">Filter by month · seasonal intensity</div>
          <div className="mig-bars">
            {MONTHS_SHORT.map((m, i) => (
              <button
                key={m}
                className={`mig-bar ${i === month ? 'active' : ''} ${
                  i === CURRENT_MONTH ? 'current' : ''
                }`}
                onClick={() => setMonth(i)}
                title={`${MONTHS[i]} · ${(SEASONALITY[i] * 100).toFixed(0)}%`}
                aria-label={MONTHS[i]}
              >
                <span className="mig-bar-track">
                  <span
                    className="mig-bar-fill"
                    style={{ height: `${(SEASONALITY[i] / 1.3) * 100}%` }}
                  />
                </span>
                <span className="mig-bar-lbl">{m[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
