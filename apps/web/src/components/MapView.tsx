'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { type Broker, type Flow } from '../data/labour';

function avatarIcon(b: Broker, active: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="avatar-pin pin-${b.kind} ${active ? 'active' : ''}">
        <img src="${b.photo}" alt="" loading="lazy" onerror="this.style.display='none'" />
        ${b.verified ? '<span class="avatar-tick"></span>' : ''}
      </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
}

function clusterIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount();
  const size = count < 5 ? 44 : count < 10 ? 52 : 60;
  return L.divIcon({
    className: '',
    html: `<div class="cluster" style="width:${size}px;height:${size}px">
        <span>${count}</span><small>brokers</small>
      </div>`,
    iconSize: [size, size],
  });
}

// Curved arc between two points for the (optional) flow layer.
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
    pts.push([
      u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1],
    ]);
  }
  return pts;
}

// Imperative marker-cluster layer (react-leaflet has no v5 wrapper for it).
function BrokerClusterLayer({
  brokers,
  selectedId,
  onSelect,
}: {
  brokers: Broker[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 55,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: clusterIcon,
    });
    const markers = brokers.map((b) => {
      const m = L.marker([b.lat, b.lng], {
        icon: avatarIcon(b, b.id === selectedId),
        zIndexOffset: b.id === selectedId ? 1000 : 0,
      });
      m.on('click', () => onSelect(b.id));
      m.bindTooltip(`${b.city} · ${b.name}`, {
        direction: 'top',
        offset: [0, -26],
        className: 'pin-tip',
        opacity: 1,
      });
      return m;
    });
    group.addLayers(markers);
    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [brokers, selectedId, map, onSelect]);
  return null;
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
    if (fly) map.flyTo([fly.lat, fly.lng], fly.zoom ?? 8, { duration: 0.9 });
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
      maxZoom={13}
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
                opacity: selectedId && !active ? 0.25 : 0.65,
                lineCap: 'round',
              }}
            />
          );
        })}

      <BrokerClusterLayer brokers={brokers} selectedId={selectedId} onSelect={onSelect} />
      <MapController fly={fly} />
    </MapContainer>
  );
}
