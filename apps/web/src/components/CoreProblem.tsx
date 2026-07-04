import Link from 'next/link';
import { CORRIDORS, HEADLINE, SEASONALITY, SOURCE } from '../data/migration';
import { CENSUS_HEADLINE, CENSUS_SOURCE, REASONS } from '../data/census';
import { ArrowRight, ArrowUpRight, Check, Flow, MapPin, Users } from './icons';
import SeasonalMapSection from './SeasonalMapSection';

// Source registry — every card cites one of these, linking to the authoritative
// source document.
interface SrcDef {
  tag: string;
  kind: 'es' | 'census' | 'seasonal';
  url: string;
}
const SRC: Record<'es' | 'census' | 'seasonal', SrcDef> = {
  es: {
    tag: 'Economic Survey 2016-17',
    kind: 'es',
    url: SOURCE.url,
  },
  census: {
    tag: 'Census 2011 · D-series',
    kind: 'census',
    url: CENSUS_SOURCE.url,
  },
  seasonal: {
    tag: 'Seasonal model · harvest & monsoon',
    kind: 'seasonal',
    url: SOURCE.url,
  },
};

const maleWork = REASONS.find((r) => r.work)?.male ?? 38;
const peak = Math.max(...SEASONALITY);
const trough = Math.min(...SEASONALITY);

interface Evidence {
  n: string;
  unit?: string;
  label: string;
  insight: string;
  src: keyof typeof SRC;
}

const EVIDENCE: Evidence[] = [
  {
    n: `${HEADLINE.annualFlowMillions}M`,
    unit: '/yr',
    label: 'inter-state migrants move for work',
    insight: 'Labour movement is enormous and continuous — scarcity is not the story.',
    src: 'es',
  },
  {
    n: '2×',
    label: 'faster migration than the 1990s',
    insight: `≈${HEADLINE.growth2001_11}% a year in 2001–11 — and still accelerating.`,
    src: 'es',
  },
  {
    n: `${CENSUS_HEADLINE.totalInternalCrore}`,
    unit: 'Cr',
    label: 'internal migrants counted in 2011',
    insight: 'The people exist. Raw supply is not the constraint.',
    src: 'census',
  },
  {
    n: `${CENSUS_HEADLINE.workSharePct}`,
    unit: '%',
    label: 'of all migration is for work',
    insight: 'The rest is marriage & family — you must isolate labour to size it.',
    src: 'census',
  },
  {
    n: `${maleWork}`,
    unit: '%',
    label: 'of male migration is for work',
    insight: 'The pool is specific: working-age men on well-worn routes.',
    src: 'census',
  },
  {
    n: `${trough}–${peak}`,
    unit: '×',
    label: 'seasonal swing in movement',
    insight: 'Monsoon trough to summer peak — timing decides who is available.',
    src: 'seasonal',
  },
];

function SourceLinks({ src }: { src: keyof typeof SRC }) {
  const s = SRC[src];
  return (
    <div className="card-src">
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="src-link">
        Source <ArrowUpRight width={12} height={12} />
      </a>
    </div>
  );
}

export default function CoreProblem() {
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
          <Link href="/map" className="doc-link doc-link-primary">
            <MapPin width={15} height={15} /> Live map
          </Link>
        </div>
      </nav>

      <div className="doc-inner">
        {/* Hero */}
        <header className="doc-hero">
          <h1 className="doc-h1 hero-headline">
            India isn’t short of{' '}
            <span className="hl green">
              <Users /> labour
            </span>
            .
            <br />
            <span className="hero-dim">It’s short of</span> the right{' '}
            <span className="hl blue">
              <Flow /> connection
            </span>
            .
          </h1>
        </header>

        {/* Misdiagnosis vs reality */}
        <section className="doc-section" style={{ paddingTop: 8 }}>
          <div className="contrast">
            <div className="contrast-card wrong">
              <div className="contrast-tag">The wrong lens</div>
              <h3>“There aren’t enough workers.”</h3>
              <p>
                Builders index the workers directly and conclude supply is scarce — chasing the same
                crews, bidding up rates, stalling sites.
              </p>
            </div>
            <div className="contrast-arrow">
              <ArrowRight width={22} height={22} />
            </div>
            <div className="contrast-card right">
              <div className="contrast-tag">The real problem</div>
              <h3>Supply is abundant but mis-matched.</h3>
              <p>
                Labour is plentiful in specific origin states and moves on predictable, seasonal
                corridors — but there’s no verified way to source it. Distribution, timing and
                discovery are broken, not the supply.
              </p>
            </div>
          </div>
        </section>

        {/* Labour movement map (shared with India on the Move) */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">Watch it move</div>
            <h2 className="doc-h2">Where labour actually is, month by month</h2>
            <p className="doc-lead">
              The same movement data, on a map. Red states send workers, green receive them, and the
              arcs thin and thicken with the season — pick a month to see where supply sits versus
              where it’s already left. Defaults to the current month.
            </p>
          </div>

          <SeasonalMapSection />

          <div className="dual-src" style={{ marginTop: 16 }}>
            <span>Built from</span>
            <a href={SOURCE.url} target="_blank" rel="noopener noreferrer" className="src-link">
              Economic Survey 2016-17 <ArrowUpRight width={12} height={12} />
            </a>
            <span className="dot">·</span>
            <span style={{ fontWeight: 500 }}>seasonal model (harvest &amp; monsoon calendar)</span>
          </div>
        </section>

        {/* Evidence cards */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">The evidence</div>
            <h2 className="doc-h2">Six numbers that reframe the shortage</h2>
            <p className="doc-lead">
              Drawn from the two most authoritative reads on Indian internal migration. Every card
              links to its source and to the full breakdown.
            </p>
          </div>
          <div className="prob-grid">
            {EVIDENCE.map((e) => (
              <div className="prob-card" key={e.label}>
                <span className={`src-tag ${SRC[e.src].kind}`}>{SRC[e.src].tag}</span>
                <div className="prob-n">
                  {e.n}
                  {e.unit && <small>{e.unit}</small>}
                </div>
                <div className="prob-label">{e.label}</div>
                <p className="prob-insight">{e.insight}</p>
                <SourceLinks src={e.src} />
              </div>
            ))}
          </div>
        </section>

        {/* The corridors — shared spine of both datasets */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">Both datasets agree</div>
            <h2 className="doc-h2">The flows are predictable</h2>
            <p className="doc-lead">
              The Census O-D matrix and the Survey’s railway flows point at the same handful of
              corridors — so supply is not random. You can pre-position against it.
            </p>
          </div>
          <div className="corridor-list">
            {CORRIDORS.slice(0, 6).map((c, i) => (
              <div className="corridor" key={`${c.from}-${c.to}`}>
                <span className="rank">{i + 1}</span>
                <span className="route">
                  <span className="o">{c.from}</span>
                  <ArrowRight width={16} height={16} />
                  <span className="d">{c.to}</span>
                </span>
                <span className="meter">
                  <span style={{ width: `${c.intensity}%` }} />
                </span>
              </div>
            ))}
          </div>
          <div className="dual-src">
            <span>Corroborated by</span>
            <a href={CENSUS_SOURCE.url} target="_blank" rel="noopener noreferrer" className="src-link">
              Census 2011 D-series <ArrowUpRight width={12} height={12} />
            </a>
            <span className="dot">·</span>
            <a href={SOURCE.url} target="_blank" rel="noopener noreferrer" className="src-link">
              Economic Survey 2016-17 <ArrowUpRight width={12} height={12} />
            </a>
          </div>
        </section>

        {/* The broker insight */}
        <section className="doc-section">
          <div className="cmm">
            <div className="doc-kicker" style={{ color: '#93c5fd' }}>
              The missing layer
            </div>
            <h2 className="doc-h2">Why brokers, not databases, solve this</h2>
            <p className="doc-lead">
              Everyone tries to fix the shortage by indexing individual workers. But in India,
              verified labour actually moves through intermediaries — thekedars, mukadams, jamadars.
              That broker layer is what makes sourcing efficient, and it is entirely informal and
              undiscoverable. Bridging builders to <em>verified</em> brokers on the corridors the data
              reveals is the unlock.
            </p>
            <div className="cmm-steps">
              <div className="cmm-step">
                <div className="idx">1</div>
                <h4>The people exist</h4>
                <p>
                  45.6 crore internal migrants; a specific, male, working-age pool moves for work.
                  Supply is real.
                </p>
              </div>
              <div className="cmm-step">
                <div className="idx">2</div>
                <h4>They move predictably</h4>
                <p>
                  ~9M a year on stable, seasonal corridors — knowable from historical & railway data.
                </p>
              </div>
              <div className="cmm-step">
                <div className="idx">3</div>
                <h4>But matching is broken</h4>
                <p>
                  No verified path from a builder’s site to the brokers who control that supply. That
                  gap is the product.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What it means */}
        <section className="doc-section">
          <div className="doc-section-head">
            <div className="doc-kicker">The thesis, in one line</div>
            <h2 className="doc-h2">Source where labour isn’t moving from</h2>
          </div>
          <div className="findings">
            <div className="finding">
              <span className="tick">
                <Check width={15} height={15} />
              </span>
              <h4>Read the flow</h4>
              <p>Predict requirement and supply from historical & seasonal movement data.</p>
            </div>
            <div className="finding">
              <span className="tick">
                <Check width={15} height={15} />
              </span>
              <h4>Point to the source</h4>
              <p>Show builders the origin regions where labour is surplus and not yet moving.</p>
            </div>
            <div className="finding">
              <span className="tick">
                <Check width={15} height={15} />
              </span>
              <h4>Connect via verified brokers</h4>
              <p>Bridge the site to vetted sourcing partners on that corridor — on a map of India.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="doc-cta">
          <h2>See the flows become sourcing</h2>
          <p>
            The live map turns these corridors into verified labour brokers you can source from,
            filtered by trade and skill.
          </p>
          <Link href="/map" className="doc-link doc-link-primary">
            <MapPin width={16} height={16} /> Open the live map
          </Link>
        </section>

        {/* Consolidated sources */}
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
            Headline figures are as reported by the cited sources. Per-state, per-corridor and
            seasonal magnitudes shown on this page are indicative indices following the published
            patterns, not official per-cell counts.
          </p>
        </section>
      </div>
    </div>
  );
}
