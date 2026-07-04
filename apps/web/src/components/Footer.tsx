import Link from 'next/link';
import { SOURCE } from '../data/migration';
import { CENSUS_SOURCE } from '../data/census';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="Mistri Mandi" width={34} height={34} />
            <span>Mistri&nbsp;Mandi</span>
          </Link>
          <p>Connecting construction builders with verified labour brokers across India.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Product</h4>
            <Link href="/labour-chowk">Labour Chowk</Link>
            <Link href="/labour-chowk">Post a requirement</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/">Manifesto</Link>
            <Link href="/insights">Our Insights</Link>
          </div>
          <div className="footer-col">
            <h4>Research</h4>
            <a href={SOURCE.url} target="_blank" rel="noopener noreferrer">
              Economic Survey 2016-17
            </a>
            <a href={CENSUS_SOURCE.url} target="_blank" rel="noopener noreferrer">
              Census 2011 D-series
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Mistri Mandi. All rights reserved.</span>
        <span className="footer-tag">Labour Chowk — sourcing that never stops.</span>
      </div>
    </footer>
  );
}
