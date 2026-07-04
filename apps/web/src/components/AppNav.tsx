'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, MapPin } from './icons';

// Modelled on nextdoor.company's tab nav: a floating segmented pill of
// icon + label items with tooltips and an active state.
const ITEMS = [
  { href: '/', label: 'Manifesto', icon: Compass, tip: 'Why India isn’t short of labour' },
  { href: '/labour-chowk', label: 'Labour Chowk', icon: MapPin, tip: 'Source verified labour brokers on the map' },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="appnav" aria-label="Primary">
      {ITEMS.map(({ href, label, icon: Icon, tip }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`appnav-item ${active ? 'active' : ''}`}
            title={tip}
            aria-current={active ? 'page' : undefined}
          >
            <Icon width={18} height={18} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
