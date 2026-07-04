'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CENSUS_FINDINGS,
  CENSUS_HEADLINE,
  CENSUS_SOURCE,
  DURATION,
  MATRIX,
  MATRIX_DESTS,
  REASONS,
  STREAMS,
  type ReasonRow,
} from '../data/census';
import { ArrowRight, Check, Flow, MapPin } from './icons';

type Segment = 'all' | 'male' | 'female';
const SEG_LABEL: Record<Segment, string> = { all: 'All migrants', male: 'Male', female: 'Female' };
const reasonVal = (r: ReasonRow, s: Segment) => (s === 'male' ? r.male : s === 'female' ? r.female : r.all);

// Blue heat colour for a 0-100 index.
function heat(v: number) {
  const a = 0.06 + (v / 100) * 0.9;
  return { background: `rgba(37, 99, 235, ${a})`, color: v > 52 ? '#fff' : 'var(--ink-soft)' };
}

export default function Census() {
  const [mounted, setMounted] = useState(false);
  const [segment, setSegment] = useState<Segment>('all');
  const [hover, setHover] = useState<{ from: string; to: string; v: number } | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const reasonsSorted = [...REASONS].sort((a, b) => reasonVal(b, segment) - reasonVal(a, segment));
  const maxReason = Math.max(...REASONS.map((r) => reasonVal(r, segment)));

  return (
    <div className="doc">
      <nav className="doc-nav">
        <div className="doc-nav-inner">
          <Link href="/" className="doc-link" style={{ paddingLeft: 10 }}>
            <span className="brand-mark" style={{ width: 24, height: 24, borderRadius: 7 }}>
              <Flow width={14} height={14} />
            </span>
            Mr.&nbsp;Mandi
          </Link>
          <span className="spacer" />
          <Link href="/india-on-the-move" className="doc-link hide-sm">
            India on the Move
          </Link>
          <Link href="/" className="doc-link doc-link-primary">
            <MapPin width={15} height={15} /> Live map
          </Link>
        </div>
      </nav>

      <div className="doc-inner">
        {/* Hero */}
        <header className="doc-hero">
          <span className="eyebrow">
            <Flow width={14} height={14} /> Office of the Registrar General · Census 2011
          </span>
          <h1 className="doc-h1">
            The <span className="grad">D-series</span> migration tables
          </h1>
          <p className="doc-sub">
            India’s foundational origin→destination matrix — every migrant counted by place of last
            residence, reason and duration, down to the district. The closest thing to a real labour-
            flow dataset.
          </p>
          <div className="big-stat">
            <span className="big-num">{CENSUS_HEADLINE.totalInternalCrore}Cr</span>
            <span className="big-cap">internal migrants counted (place of last residence)</span>
          </div>
        </header>

        {/* Stat cards */}
        <section className="doc-section" style={{ paddingTop: 8 }}>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="n">
                {CENSUS_HEADLINE.totalInternalCrore}<small>Cr</small>
              </div>
              <div className="l">Total internal migrants by place of last residence</div>
            </div>
            <div className="stat-card">
              <div className="n">
                {CENSUS_HEADLINE.shareOfPopulationPct}<small>%</small>
              </div>
              <div className="l">Of India’s population were migrants in 2011</div>
            </div>
            <div className="stat-card">
              <div className="n">
                {CENSUS_HEADLINE.interStateCrore}<small>Cr</small>
              </div>
              <div className="l">Inter-state migrants — the long-haul labour moves</div>
            </div>
            <div className="stat-card">
              <div className="n accent">
                {CENSUS_HEADLINE.workSharePct}<small>%</small>
              </div>
              <div className="l">Migrated for work / employment (all migrants)</div>
            </div>
          </div>
        </section>

        {/* Reason for migration */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">Table D-5 · why people move</div>
            <h2 className="doc-h2">Reason for migration</h2>
            <p className="doc-lead">
              Marriage dominates the totals — but that’s driven by women. Switch to male migrants and
              work/employment jumps to the top. That’s the labour signal hiding inside the aggregate.
            </p>
          </div>

          <div className="seg">
            {(['all', 'male', 'female'] as Segment[]).map((s) => (
              <button
                key={s}
                className={`seg-btn ${segment === s ? 'active' : ''}`}
                onClick={() => setSegment(s)}
              >
                {SEG_LABEL[s]}
              </button>
            ))}
          </div>

          <div className="chart-panel" style={{ marginTop: 16 }}>
            {reasonsSorted.map((r) => {
              const v = reasonVal(r, segment);
              return (
                <div className="bar-item" key={r.reason}>
                  <span className="bar-label" style={r.work ? { color: 'var(--accent)', fontWeight: 700 } : undefined}>
                    {r.reason}
                  </span>
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      style={{
                        width: mounted ? `${(v / maxReason) * 100}%` : 0,
                        background: r.work
                          ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
                          : 'linear-gradient(90deg, #cbd5e1, #94a3b8)',
                      }}
                    />
                  </span>
                  <span className="bar-val">{v}%</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* O-D matrix */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">The origin→destination matrix</div>
            <h2 className="doc-h2">Where work migrants come from & go</h2>
            <p className="doc-lead">
              Each cell is the intensity of work migration from an origin state (row) to a destination
              state (column). Darker = heavier flow. Hover a cell to read the corridor. Values are a
              0–100 index following Census 2011 corridor patterns.
            </p>
          </div>

          <div className="matrix-wrap">
            <div className="matrix-readout">
              {hover ? (
                <>
                  <span className="o">{hover.from}</span>
                  <ArrowRight width={15} height={15} />
                  <span className="d">{hover.to}</span>
                  <span className="v">{hover.v}</span>
                </>
              ) : (
                <span className="muted">Hover a cell to inspect a corridor →</span>
              )}
            </div>
            <div className="matrix-scroll">
              <table className="matrix">
                <thead>
                  <tr>
                    <th className="corner">Origin ↓ / Dest →</th>
                    {MATRIX_DESTS.map((d) => (
                      <th key={d} className="dest-h">
                        <span>{d}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((row) => (
                    <tr key={row.from}>
                      <th className="origin-h">{row.from}</th>
                      {row.cells.map((v, i) => (
                        <td
                          key={i}
                          className="cell"
                          style={heat(v)}
                          onMouseEnter={() => setHover({ from: row.from, to: MATRIX_DESTS[i], v })}
                          onMouseLeave={() => setHover(null)}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Streams + duration */}
        <section className="doc-section">
          <div className="chart-cols">
            <div className="chart-panel">
              <h3>Migration streams</h3>
              <div className="hint">Rural/urban origin → destination · work migrants</div>
              {STREAMS.map((s) => (
                <div className="bar-item" key={s.label}>
                  <span className="bar-label" title={s.hint}>
                    {s.label}
                  </span>
                  <span className="bar-track">
                    <span
                      className="bar-fill in"
                      style={{ width: mounted ? `${(s.pct / 54) * 100}%` : 0 }}
                    />
                  </span>
                  <span className="bar-val">{s.pct}%</span>
                </div>
              ))}
            </div>
            <div className="chart-panel">
              <h3>Duration at destination</h3>
              <div className="hint">How long migrants have lived where they moved to</div>
              {DURATION.map((d) => (
                <div className="bar-item" key={d.label}>
                  <span className="bar-label">{d.label}</span>
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      style={{
                        width: mounted ? `${(d.pct / 26) * 100}%` : 0,
                        background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                      }}
                    />
                  </span>
                  <span className="bar-val">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Findings */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">In short</div>
            <h2 className="doc-h2">What the D-tables tell builders</h2>
          </div>
          <div className="findings">
            {CENSUS_FINDINGS.map((f) => (
              <div className="finding" key={f.title}>
                <span className="tick">
                  <Check width={15} height={15} />
                </span>
                <h4>{f.title}</h4>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="doc-cta">
          <h2>Turn the matrix into sourcing</h2>
          <p>
            Mr. Mandi builds on exactly this O-D structure — mapping verified labour brokers in the
            origin districts these corridors flow from.
          </p>
          <Link href="/" className="doc-link doc-link-primary">
            <MapPin width={16} height={16} /> Open the live map
          </Link>
        </section>

        {/* Source */}
        <div className="source-note">
          <strong>Source.</strong> {CENSUS_SOURCE.publication} — {CENSUS_SOURCE.title},{' '}
          {CENSUS_SOURCE.authority}. Headline aggregates (~45.6 crore internal migrants; ~37% of
          population; ~5.4 crore inter-state; ~10% for work) are as published. The O-D matrix and the
          male/female reason splits are shown as an index / indicative shares — the patterns follow
          the D-series tables, not a reproduction of per-cell counts.{' '}
          <a href={CENSUS_SOURCE.url} target="_blank" rel="noopener noreferrer">
            Census 2011 tables →
          </a>
        </div>
      </div>
    </div>
  );
}
