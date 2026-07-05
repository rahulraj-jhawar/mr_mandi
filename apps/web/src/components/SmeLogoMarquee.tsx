import { getAvailableSmePartners, type SmePartner } from '../data/smes';

function LogoRow({ partners, ariaHidden }: { partners: SmePartner[]; ariaHidden?: boolean }) {
  return (
    <>
      {partners.map((sme) => (
        <div key={`${ariaHidden ? 'dup-' : ''}${sme.id}`} className="sme-logo-item">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="sme-logo"
            src={sme.logo}
            alt={ariaHidden ? '' : `${sme.name} logo`}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      ))}
    </>
  );
}

export default function SmeLogoMarquee() {
  const partners = getAvailableSmePartners();
  if (partners.length === 0) return null;

  return (
    <section className="doc-section sme-marquee-section" aria-label="Manifesto interest">
      <div className="doc-section-head sme-marquee-head">
        <div className="doc-kicker">Manifesto interest</div>
        <h2 className="doc-h3">SMEs who see labour as a connection problem, not a supply problem</h2>
      </div>

      <div className="sme-marquee" role="region" aria-label="Companies interested in the Mistri Mandi manifesto">
        <div className="sme-marquee-track">
          <LogoRow partners={partners} />
          <LogoRow partners={partners} ariaHidden />
        </div>
      </div>
    </section>
  );
}
