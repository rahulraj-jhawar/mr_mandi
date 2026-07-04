import Link from 'next/link';
import { SOURCE } from '../data/migration';
import { ArrowRight, ArrowUpRight, Flow, MapPin, Users } from './icons';
import SeasonalMapSection from './SeasonalMapSection';
import Footer from './Footer';

export default function CoreProblem() {
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
            <Link href="/labour-chowk" className="nav-link hide-sm">
              <MapPin width={17} height={17} /> Labour Chowk
            </Link>
            <Link href="/labour-chowk" className="nav-cta">
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

        {/* Labour movement map */}
        <section className="doc-section" style={{ paddingTop: 8 }}>
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

        {/* CTA */}
        <section className="doc-cta">
          <h2>Mistri Mandi, Your Site never stops</h2>
          <Link href="/labour-chowk" className="doc-cta-btn" style={{ marginTop: 8 }}>
            <MapPin width={16} height={16} /> Open Labour Chowk
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
