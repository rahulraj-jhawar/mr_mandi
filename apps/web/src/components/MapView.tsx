'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import { type Broker, type Flow, poolTotal } from '../data/labour';

const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`);

function brokerIcon(b: Broker, active: boolean) {
  const kindClass = `pin-${b.kind}`;
  const pulse = b.kind === 'demand' ? '<span class="pin-pulse"></span>' : '';
  const label = fmtK(poolTotal(b.pool));
  return L.divIcon({
    className: 'pin-wrap',
    html: `<div class="pin ${kindClass} ${active ? 'active' : ''}">${pulse}<span class="pin-bubble">${label}</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

// Quadratic-bezier samples between two points, bowed perpendicular to the chord
// so labour flows read as arcs rather than straight lines.
function arcPoints(a: [number, number], b: [number, number], bend = 0.22): [number, number][] {
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const dLat = b[0] - a[0];
  const dLng = b[1] - a[1];
  const ctrl: [number, number] = [mid[0] + dLng * bend, mid[1] - dLat * bend];
  const pts: [number, number][] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const u = 1 - t;
    const lat = u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0];
    const lng = u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1];
    pts.push([lat, lng]);
  }
  return pts;
}

export interface FlyTarget {
  lat: number;
  lng: number;
  zoom?: number;
  key: number;
}

function MapController({ fly }: { fly: FlyTarget | null }) {
  const map = useMap();
  useEffect(() => {
    if (fly) map.flyTo([fly.lat, fly.lng], fly.zoom ?? 7, { duration: 0.9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fly?.key]);
  return null;
}

interface Props {
  brokers: Broker[];
  flows: Flow[];
  brokerIndex: Record<string, Broker>;
  selectedId: string | null;
  showFlows: boolean;
  onSelect: (id: string) => void;
  fly: FlyTarget | null;
}

export default function MapView({
  brokers,
  flows,
  brokerIndex,
  selectedId,
  showFlows,
  onSelect,
  fly,
}: Props) {
  return (
    <MapContainer
      center={[22.4, 80]}
      zoom={5}
      minZoom={4}
      maxZoom={12}
      zoomControl={false}
      attributionControl
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />

      {showFlows &&
        flows.map((f) => {
          const from = brokerIndex[f.from];
          const to = brokerIndex[f.to];
          if (!from || !to) return null;
          const active = selectedId === f.from || selectedId === f.to;
          const weight = Math.max(1.5, Math.min(6, f.workers / 900));
          return (
            <Polyline
              key={`${f.from}-${f.to}`}
              positions={arcPoints([from.lat, from.lng], [to.lat, to.lng])}
              pathOptions={{
                className: 'flow-path',
                color: active ? '#2563eb' : '#94a3b8',
                weight: active ? weight + 1 : weight,
                opacity: selectedId && !active ? 0.25 : 0.7,
                lineCap: 'round',
              }}
            />
          );
        })}

      {brokers.map((b) => (
        <Marker
          key={b.id}
          position={[b.lat, b.lng]}
          icon={brokerIcon(b, selectedId === b.id)}
          zIndexOffset={selectedId === b.id ? 1000 : b.kind === 'demand' ? 400 : 200}
          eventHandlers={{ click: () => onSelect(b.id) }}
        >
          <Tooltip direction="top" offset={[0, -20]} className="pin-tip" opacity={1}>
            {b.city} · {b.name}
          </Tooltip>
        </Marker>
      ))}

      <MapController fly={fly} />
    </MapContainer>
  );
}
