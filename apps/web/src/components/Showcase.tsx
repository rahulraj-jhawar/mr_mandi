'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  CORRIDORS,
  DESTINATIONS,
  FINDINGS,
  HEADLINE,
  MONTHS,
  MONTHS_SHORT,
  MONTH_NOTE,
  ORIGINS,
  SEASONALITY,
  SOURCE,
  monthlyMoversLakh,
} from '../data/migration';
import { ArrowRight, Check, Flow, MapPin } from './icons';

const MigrationMap = dynamic(() => import('./MigrationMap'), {
  ssr: false,
  loading: () => (
    <div className="map-loading" style={{ position: 'absolute' }}>
      <div className="spinner" />
    </div>
  ),
});

const CURRENT_MONTH = new Date().getMonth();

// Count up to `to` once, when first scrolled into view.
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

export default function Showcase() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const [flow, flowRef] = useCountUp(HEADLINE.annualFlowMillions, 0);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const isCurrent = month === CURRENT_MONTH;

  return (
    <div className="doc">
      {/* Nav */}
      <nav className="doc-nav">
        <div className="doc-nav-inner">
          <Link href="/" className="doc-link" style={{ paddingLeft: 10 }}>
            <span
              className="brand-mark"
              style={{ width: 24, height: 24, borderRadius: 7 }}
            >
              <Flow width={14} height={14} />
            </span>
            Mr.&nbsp;Mandi
          </Link>
          <span className="spacer" />
          <Link href="/census-2011" className="doc-link hide-sm">
            Census 2011
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
            <Flow width={14} height={14} /> Ministry of Finance · Govt. of India
          </span>
          <h1 className="doc-h1">
            India <span className="grad">on the Move</span>
          </h1>
          <p className="doc-sub">
            The first official estimate of internal labour migration built from unreserved
            railway-passenger data — the same movement patterns Mr. Mandi turns into live sourcing
            signals.
          </p>
          <div className="big-stat">
            <span className="big-num" ref={flowRef}>
              {flow}M
            </span>
            <span className="big-cap">
              inter-state migrants a year · {HEADLINE.periodFrom}–{HEADLINE.periodTo}
            </span>
          </div>
        </header>

        {/* Stat cards */}
        <section className="doc-section" style={{ paddingTop: 8 }}>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="n">
                ~9<small>M/yr</small>
              </div>
              <div className="l">Average annual inter-state migrant flow, 2011–2016</div>
            </div>
            <div className="stat-card">
              <div className="n accent">
                {HEADLINE.growth2001_11}<small>%</small>
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

        {/* Month-wise interactive flow map */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">Movement through the year</div>
            <h2 className="doc-h2">Inter-state movement, month by month</h2>
            <p className="doc-lead">
              Labour flows follow the harvest, monsoon and festival calendar. Pick a month to see the
              seasonal average — how much movement toward the cities a typical{' '}
              {MONTHS[month]} carries. Defaults to the current month.
            </p>
          </div>

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
                  est. inter-state movers · seasonal average vs {(SEASONALITY[month] * 100).toFixed(0)}
                  % of the yearly norm
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
        </section>

        {/* CMM explainer */}
        <section className="doc-section">
          <div className="cmm">
            <div className="doc-kicker" style={{ color: '#93c5fd' }}>
              The method
            </div>
            <h2 className="doc-h2">The Cohort-Based Migration Metric</h2>
            <p className="doc-lead">
              Rather than count migrants directly, the Survey tracked how age cohorts change between
              the 2001 and 2011 Censuses — then cross-checked the result against real railway
              passenger traffic.
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
                  Where a state has fewer people than expected, workers left; where it has more, they
                  arrived. That deviation is net migration.
                </p>
              </div>
              <div className="cmm-step">
                <div className="idx">3</div>
                <h4>Validate with railways</h4>
                <p>
                  Unreserved railway passenger flows between states confirmed the scale — about 9
                  million net movers a year over 2011–2016.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Origin / destination bars */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">Where labour comes from, where it goes</div>
            <h2 className="doc-h2">Sources & destinations</h2>
            <p className="doc-lead">
              Net flows run from lower-income origin states to high-wage destinations. Magnitudes are
              shown as an index (100 = highest); rankings follow the Survey and Census 2011.
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
                    <span
                      className="bar-fill out"
                      style={{ width: mounted ? `${s.index}%` : 0 }}
                    />
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
                    <span
                      className="bar-fill in"
                      style={{ width: mounted ? `${s.index}%` : 0 }}
                    />
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
            <p className="doc-lead">
              A handful of origin→destination corridors carry most of the movement — the exact routes
              a sourcing platform needs to pre-position supply against.
            </p>
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
                  Growth nearly doubled — labour is moving further and more often, chasing
                  construction and services demand.
                </div>
                <span className="accel-tag">≈ 2× the prior decade</span>
              </div>
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
            {FINDINGS.map((f) => (
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
          <h2>From national patterns to your next site</h2>
          <p>
            Mr. Mandi turns these corridors into live sourcing — showing verified labour brokers on a
            map of India and where to source when workers aren’t moving from there.
          </p>
          <Link href="/" className="doc-link doc-link-primary">
            <MapPin width={16} height={16} /> Open the live map
          </Link>
        </section>

        {/* Source */}
        <div className="source-note">
          <strong>Source.</strong> {SOURCE.title} — {SOURCE.publication}, {SOURCE.authority}. Headline
          figures (≈9M annual flow, 2011–2016; ~4.5% vs ~2.4% growth) are as reported by the Survey.
          Per-state and per-corridor values on this page are shown as a normalised index for
          illustration — the rankings follow the Survey and Census 2011 work-migration patterns, not
          an official per-state flow table.{' '}
          <a href={SOURCE.url} target="_blank" rel="noopener noreferrer">
            Read the chapter (PDF) →
          </a>
        </div>
      </div>
    </div>
  );
}
