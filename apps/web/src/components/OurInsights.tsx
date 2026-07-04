'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CORRIDORS, DESTINATIONS, FINDINGS, HEADLINE, ORIGINS, SOURCE } from '../data/migration';
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
import { ArrowRight, ArrowUpRight, Check, MapPin } from './icons';
import SeasonalMapSection from './SeasonalMapSection';
import Footer from './Footer';

function useCountUp(to: number, decimals = 0) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done.current) {
          done.current = true;
          const dur = 1100;
          let start: number | null = null;
          const tick = (t: number) => {
            if (start === null) start = t;
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setVal(to);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return [val.toFixed(decimals), ref] as const;
}

type Segment = 'all' | 'male' | 'female';
const SEG_LABEL: Record<Segment, string> = { all: 'All migrants', male: 'Male', female: 'Female' };
const reasonVal = (r: ReasonRow, s: Segment) =>
  s === 'male' ? r.male : s === 'female' ? r.female : r.all;

function heat(v: number) {
  const a = 0.06 + (v / 100) * 0.9;
  return { background: `rgba(37, 99, 235, ${a})`, color: v > 52 ? '#fff' : 'var(--ink-soft)' };
}

export default function OurInsights() {
  const [mounted, setMounted] = useState(false);
  const [segment, setSegment] = useState<Segment>('all');
  const [hover, setHover] = useState<{ from: string; to: string; v: number } | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const [flow, flowRef] = useCountUp(HEADLINE.annualFlowMillions, 0);
  const reasonsSorted = [...REASONS].sort((a, b) => reasonVal(b, segment) - reasonVal(a, segment));
  const maxReason = Math.max(...REASONS.map((r) => reasonVal(r, segment)));

  return (
    <div className="doc">
      <nav className="doc-nav">
        <div className="navbar">
          <Link href="/" className="nav-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src="/logo-mark.png" alt="Mistri Mandi" width={34} height={34} />
            <span className="nav-brand-name">Mistri&nbsp;Mandi</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link hide-sm">
              Manifesto
            </Link>
            <Link href="/labour-chowk" className="nav-cta">
              <MapPin width={16} height={16} /> Labour Chowk
            </Link>
          </div>
        </div>
      </nav>

      <div className="doc-inner">
        {/* Hero */}
        <header className="doc-hero">
          <span className="eyebrow">Our insights</span>
          <h1 className="doc-h1">
            The <span className="grad">data</span> behind Mistri&nbsp;Mandi
          </h1>
          <p className="doc-sub">
            Every claim we make is grounded in India’s two most authoritative reads on internal labour
            migration — the Economic Survey 2016-17 and the Census 2011 D-series. Here is all of it, in
            one place.
          </p>
        </header>

        {/* ==================== INDIA ON THE MOVE ==================== */}
        <section className="doc-section" style={{ paddingTop: 8 }}>
          <div className="doc-section-head">
            <div className="doc-kicker">Economic Survey 2016-17 · India on the Move</div>
            <h2 className="doc-h2">9 million move for work, every year</h2>
            <p className="doc-lead">
              The first official estimate of internal labour migration built from unreserved
              railway-passenger data.
            </p>
          </div>
          <div className="big-stat" style={{ margin: '8px auto 28px' }}>
            <span className="big-num" ref={flowRef}>
              {flow}M
            </span>
            <span className="big-cap">
              inter-state migrants a year · {HEADLINE.periodFrom}–{HEADLINE.periodTo}
            </span>
          </div>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="n">
                ~9<small>M/yr</small>
              </div>
              <div className="l">Average annual inter-state migrant flow, 2011–2016</div>
            </div>
            <div className="stat-card">
              <div className="n accent">
                {HEADLINE.growth2001_11}
                <small>%</small>
              </div>
              <div className="l">Annual growth of work migration in 2001–11</div>
            </div>
            <div className="stat-card">
              <div className="n">
                2<small>×</small>
              </div>
              <div className="l">Faster than the previous decade (~{HEADLINE.growth1991_01}%/yr)</div>
            </div>
            <div className="stat-card">
              <div className="n">1st</div>
              <div className="l">Estimate to use railway data instead of Census stock alone</div>
            </div>
          </div>
        </section>

        {/* Seasonal map */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">Movement through the year</div>
            <h2 className="doc-h2">Inter-state movement, month by month</h2>
          </div>
          <SeasonalMapSection />
        </section>

        {/* CMM */}
        <section className="doc-section">
          <div className="cmm">
            <div className="doc-kicker" style={{ color: '#93c5fd' }}>
              The method
            </div>
            <h2 className="doc-h2">The Cohort-Based Migration Metric</h2>
            <p className="doc-lead">
              Rather than count migrants directly, the Survey tracked how age cohorts change between
              the 2001 and 2011 Censuses — then cross-checked against real railway passenger traffic.
            </p>
            <div className="cmm-steps">
              <div className="cmm-step">
                <div className="idx">1</div>
                <h4>Follow a cohort</h4>
                <p>
                  Take a demographic group (e.g. 15–29 year-olds) and see how many should remain a
                  decade later, netting out births and deaths.
                </p>
              </div>
              <div className="cmm-step">
                <div className="idx">2</div>
                <h4>Read the gap as migration</h4>
                <p>
                  Fewer people than expected means workers left; more means they arrived. That
                  deviation is net migration.
                </p>
              </div>
              <div className="cmm-step">
                <div className="idx">3</div>
                <h4>Validate with railways</h4>
                <p>
                  Unreserved railway passenger flows confirmed the scale — about 9 million net movers a
                  year over 2011–2016.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Origin / destination */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">Where labour comes from, where it goes</div>
            <h2 className="doc-h2">Sources &amp; destinations</h2>
            <p className="doc-lead">
              Net flows run from lower-income origin states to high-wage destinations. Magnitudes shown
              as an index (100 = highest); rankings follow the Survey and Census 2011.
            </p>
          </div>
          <div className="chart-cols">
            <div className="chart-panel">
              <h3>Top origin states</h3>
              <div className="hint">Net out-migration of workers</div>
              {ORIGINS.map((s) => (
                <div className="bar-item" key={s.code}>
                  <span className="bar-label">{s.state}</span>
                  <span className="bar-track">
                    <span className="bar-fill out" style={{ width: mounted ? `${s.index}%` : 0 }} />
                  </span>
                  <span className="bar-val">{s.index}</span>
                </div>
              ))}
            </div>
            <div className="chart-panel">
              <h3>Top destination states</h3>
              <div className="hint">Net in-migration of workers</div>
              {DESTINATIONS.map((s) => (
                <div className="bar-item" key={s.code}>
                  <span className="bar-label">{s.state}</span>
                  <span className="bar-track">
                    <span className="bar-fill in" style={{ width: mounted ? `${s.index}%` : 0 }} />
                  </span>
                  <span className="bar-val">{s.index}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corridors */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">The busiest routes</div>
            <h2 className="doc-h2">Top migration corridors</h2>
          </div>
          <div className="corridor-list">
            {CORRIDORS.map((c, i) => (
              <div className="corridor" key={`${c.from}-${c.to}`}>
                <span className="rank">{i + 1}</span>
                <span className="route">
                  <span className="o">{c.from}</span>
                  <ArrowRight width={16} height={16} />
                  <span className="d">{c.to}</span>
                </span>
                <span className="meter">
                  <span style={{ width: mounted ? `${c.intensity}%` : 0 }} />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Acceleration */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">And it is speeding up</div>
            <h2 className="doc-h2">Migration is accelerating</h2>
          </div>
          <div className="accel">
            <div className="accel-card">
              <div>
                <div className="accel-period">1991 – 2001</div>
                <div className="accel-num">
                  {HEADLINE.growth1991_01}
                  <small>% / yr</small>
                </div>
              </div>
              <div className="accel-desc">Annual growth of inter-state migration for work.</div>
            </div>
            <div className="accel-card hi">
              <div>
                <div className="accel-period">2001 – 2011</div>
                <div className="accel-num">
                  {HEADLINE.growth2001_11}
                  <small>% / yr</small>
                </div>
              </div>
              <div>
                <div className="accel-desc">
                  Growth nearly doubled — labour is moving further and more often, chasing construction
                  and services demand.
                </div>
                <span className="accel-tag">≈ 2× the prior decade</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CENSUS 2011 ==================== */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">Census of India 2011 · D-series</div>
            <h2 className="doc-h2">The origin→destination matrix</h2>
            <p className="doc-lead">
              India’s foundational migration dataset — every migrant counted by place of last
              residence, reason and duration, down to the district.
            </p>
          </div>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="n">
                {CENSUS_HEADLINE.totalInternalCrore}
                <small>Cr</small>
              </div>
              <div className="l">Total internal migrants by place of last residence</div>
            </div>
            <div className="stat-card">
              <div className="n">
                {CENSUS_HEADLINE.shareOfPopulationPct}
                <small>%</small>
              </div>
              <div className="l">Of India’s population were migrants in 2011</div>
            </div>
            <div className="stat-card">
              <div className="n">
                {CENSUS_HEADLINE.interStateCrore}
                <small>Cr</small>
              </div>
              <div className="l">Inter-state migrants — the long-haul labour moves</div>
            </div>
            <div className="stat-card">
              <div className="n accent">
                {CENSUS_HEADLINE.workSharePct}
                <small>%</small>
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
              Marriage dominates the totals — driven by women. Switch to male migrants and
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
                  <span
                    className="bar-label"
                    style={r.work ? { color: 'var(--accent)', fontWeight: 700 } : undefined}
                  >
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
            <div className="doc-kicker">Work-migration corridors</div>
            <h2 className="doc-h2">Where work migrants come from &amp; go</h2>
            <p className="doc-lead">
              Each cell is the intensity of work migration from an origin state (row) to a destination
              (column). Darker = heavier. Hover a cell to read the corridor; values are a 0–100 index.
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
                    <span className="bar-fill in" style={{ width: mounted ? `${(s.pct / 54) * 100}%` : 0 }} />
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
            <h2 className="doc-h2">What the data tells builders</h2>
          </div>
          <div className="findings">
            {[...FINDINGS, ...CENSUS_FINDINGS].map((f) => (
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

        {/* Sources */}
        <section className="doc-section" style={{ paddingBottom: 12 }}>
          <div className="doc-kicker" style={{ marginBottom: 14 }}>
            Sources
          </div>
          <div className="src-list">
            <a href={SOURCE.url} target="_blank" rel="noopener noreferrer" className="src-row">
              <span className="src-tag es">Economic Survey 2016-17</span>
              <span className="src-row-body">
                <b>{SOURCE.title}</b> — {SOURCE.publication}, {SOURCE.authority}.
              </span>
              <ArrowUpRight width={16} height={16} />
            </a>
            <a href={CENSUS_SOURCE.url} target="_blank" rel="noopener noreferrer" className="src-row">
              <span className="src-tag census">Census 2011</span>
              <span className="src-row-body">
                <b>{CENSUS_SOURCE.title}</b> — {CENSUS_SOURCE.publication}, {CENSUS_SOURCE.authority}.
              </span>
              <ArrowUpRight width={16} height={16} />
            </a>
          </div>
          <p className="source-note" style={{ borderTop: 'none', paddingTop: 18 }}>
            Headline figures are as reported by the cited sources. Per-state, per-corridor and seasonal
            magnitudes are indicative indices following the published patterns, not official per-cell
            counts.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
