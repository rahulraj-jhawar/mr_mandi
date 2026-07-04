import Link from 'next/link';
import { SOURCE } from '../data/migration';
import { CENSUS_SOURCE } from '../data/census';
import { ArrowRight, ArrowUpRight, Check, Close, Flow, MapPin, Users } from './icons';
import SeasonalMapSection from './SeasonalMapSection';

export default function CoreProblem() {
  return (
    <div className="doc">
      <nav className="doc-nav">
        <div className="navbar">
          <Link href="/" className="nav-brand">
            <span className="brand-mark" style={{ width: 30, height: 30, borderRadius: 9 }}>
              <Flow width={18} height={18} />
            </span>
            <span className="nav-brand-name">Mr.&nbsp;Mandi</span>
          </Link>
          <div className="nav-links">
            <Link href="/map" className="nav-link hide-sm">
              <MapPin width={17} height={17} /> Live map
              <span className="nav-new">New</span>
            </Link>
            <a href="#sources" className="nav-link hide-sm">
              <Flow width={17} height={17} /> Sources
            </a>
            <Link href="/map" className="nav-cta">
              Post a requirement <ArrowRight width={16} height={16} />
            </Link>
          </div>
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
              <div className="contrast-tag">
                <Close width={12} height={12} /> The wrong lens
              </div>
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
              <div className="contrast-tag">
                <Check width={12} height={12} /> The real problem
              </div>
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

        {/* The broker insight — sits directly below the map */}
        <section className="doc-section">
          <div className="cmm">
            <div className="doc-kicker" style={{ color: '#93c5fd' }}>
              The missing layer
            </div>
            <h2 className="doc-h2">Why brokers, not databases, solve this</h2>
            <div className="cmm-steps">
              <div className="cmm-step">
                <div className="idx">1</div>
                <h4>Read the flow</h4>
                <p>Predict requirement and supply from historical &amp; seasonal movement data.</p>
              </div>
              <div className="cmm-step">
                <div className="idx">2</div>
                <h4>Point to the source</h4>
                <p>Show builders the origin regions where labour is surplus and not yet moving.</p>
              </div>
              <div className="cmm-step">
                <div className="idx">3</div>
                <h4>Connect via verified brokers</h4>
                <p>Bridge the site to vetted sourcing partners on that corridor — on a map of India.</p>
              </div>
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
          <Link href="/map" className="doc-cta-btn">
            <MapPin width={16} height={16} /> Open the live map
          </Link>
        </section>

        {/* Consolidated sources */}
        <section className="doc-section" id="sources" style={{ paddingBottom: 12 }}>
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
        </section>
      </div>
    </div>
  );
}
