'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import {
  CORRIDORS,
  DESTINATIONS,
  ORIGINS,
  SEASONALITY,
  STATE_COORDS,
} from '../data/migration';

function arcPoints(a: [number, number], b: [number, number], bend = 0.2): [number, number][] {
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const dLat = b[0] - a[0];
  const dLng = b[1] - a[1];
  const ctrl: [number, number] = [mid[0] + dLng * bend, mid[1] - dLat * bend];
  const pts: [number, number][] = [];
  const N = 26;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const u = 1 - t;
    pts.push([
      u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1],
    ]);
  }
  return pts;
}

const originIndex: Record<string, number> = Object.fromEntries(
  ORIGINS.map((s) => [s.state, s.index]),
);
const destIndex: Record<string, number> = Object.fromEntries(
  DESTINATIONS.map((s) => [s.state, s.index]),
);

// Distinct states that take part in at least one corridor, with their role.
const NODES = (() => {
  const seen = new Map<string, { role: 'origin' | 'dest'; index: number }>();
  for (const c of CORRIDORS) {
    if (!seen.has(c.from)) seen.set(c.from, { role: 'origin', index: originIndex[c.from] ?? 40 });
    if (!seen.has(c.to)) seen.set(c.to, { role: 'dest', index: destIndex[c.to] ?? 40 });
  }
  return [...seen.entries()].map(([state, v]) => ({ state, ...v }));
})();

function nodeIcon(state: string, role: 'origin' | 'dest', index: number) {
  const size = 12 + (index / 100) * 16; // 12–28px
  const color = role === 'origin' ? '#e11d48' : '#16a34a';
  return L.divIcon({
    className: 'mig-node-wrap',
    html: `<div class="mig-node ${role}" style="width:${size}px;height:${size}px;background:${color}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MigrationMap({ month }: { month: number }) {
  const factor = SEASONALITY[month];

  return (
    <MapContainer
      center={[22.8, 80]}
      zoom={5}
      minZoom={4}
      maxZoom={8}
      zoomControl
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />

      {CORRIDORS.map((c) => {
        const from = STATE_COORDS[c.from];
        const to = STATE_COORDS[c.to];
        if (!from || !to) return null;
        const monthIntensity = c.intensity * factor; // seasonal scaling
        const weight = Math.max(1, Math.min(8, (monthIntensity / 100) * 8));
        const opacity = 0.28 + (monthIntensity / 130) * 0.5;
        return (
          <Polyline
            key={`${c.from}-${c.to}-${month}`}
            positions={arcPoints(from, to)}
            pathOptions={{
              className: 'flow-path',
              color: '#2563eb',
              weight,
              opacity: Math.min(0.85, opacity),
              lineCap: 'round',
            }}
          />
        );
      })}

      {NODES.map((n) => {
        const coord = STATE_COORDS[n.state];
        if (!coord) return null;
        return (
          <Marker key={n.state} position={coord} icon={nodeIcon(n.state, n.role, n.index)}>
            <Tooltip direction="top" offset={[0, -8]} className="pin-tip" opacity={1}>
              {n.state} · {n.role === 'origin' ? 'sends workers' : 'receives workers'}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
