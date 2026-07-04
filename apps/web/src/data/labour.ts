// Mock dataset powering the labour-flow map.
// Numbers are illustrative — modelled on real migration corridors in Indian
// construction, but not sourced from a live feed.

export type HubKind = 'source' | 'demand' | 'balanced';

export type Trade =
  | 'Mason'
  | 'Bar bender'
  | 'Carpenter'
  | 'Shuttering'
  | 'Painter'
  | 'Electrician'
  | 'Plumber'
  | 'Helper'
  | 'Operator';

export interface WorkerPool {
  skilled: number;
  semiSkilled: number;
  unskilled: number;
}

export interface Broker {
  id: string;
  name: string;
  contact: string; // masked
  city: string;
  state: string;
  lat: number;
  lng: number;
  kind: HubKind;
  verified: boolean;
  rating: number; // out of 5
  since: number; // year active
  pool: WorkerPool;
  trades: Trade[];
  dayRate: [number, number]; // ₹ per day range
  // A short model note explaining why this hub matters.
  note: string;
}

export interface Flow {
  from: string; // broker id (origin / surplus)
  to: string; // broker id (destination / demand)
  workers: number; // predicted monthly movement
  trend: 'rising' | 'steady' | 'cooling';
}

export const BROKERS: Broker[] = [
  // ---- Surplus / origin hubs (where verified labour is available to source) ----
  {
    id: 'patna',
    name: 'Maa Vaishno Labour Suppliers',
    contact: '+91 90••• ••231',
    city: 'Patna',
    state: 'Bihar',
    lat: 25.5941,
    lng: 85.1376,
    kind: 'source',
    verified: true,
    rating: 4.7,
    since: 2014,
    pool: { skilled: 1850, semiSkilled: 3200, unskilled: 5400 },
    trades: ['Mason', 'Bar bender', 'Helper', 'Shuttering'],
    dayRate: [520, 780],
    note: 'Bihar is India’s largest labour-origin state. Off-season surplus peaks Jun–Sep.',
  },
  {
    id: 'gorakhpur',
    name: 'Purvanchal Shramik Sangh',
    contact: '+91 94••• ••118',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    lat: 26.7606,
    lng: 83.3732,
    kind: 'source',
    verified: true,
    rating: 4.5,
    since: 2011,
    pool: { skilled: 2100, semiSkilled: 4100, unskilled: 6900 },
    trades: ['Mason', 'Carpenter', 'Helper', 'Painter'],
    dayRate: [500, 820],
    note: 'Eastern UP corridor feeds Delhi-NCR and Mumbai year-round.',
  },
  {
    id: 'ranchi',
    name: 'Jharkhand Skilled Manpower Co.',
    contact: '+91 91••• ••744',
    city: 'Ranchi',
    state: 'Jharkhand',
    lat: 23.3441,
    lng: 85.3096,
    kind: 'source',
    verified: true,
    rating: 4.4,
    since: 2016,
    pool: { skilled: 980, semiSkilled: 1700, unskilled: 3100 },
    trades: ['Bar bender', 'Shuttering', 'Helper', 'Operator'],
    dayRate: [540, 800],
    note: 'Strong RCC & shuttering crews. Availability firm outside kharif season.',
  },
  {
    id: 'bhubaneswar',
    name: 'Kalinga Workforce Partners',
    contact: '+91 93••• ••507',
    city: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.2961,
    lng: 85.8245,
    kind: 'source',
    verified: true,
    rating: 4.3,
    since: 2018,
    pool: { skilled: 760, semiSkilled: 1500, unskilled: 2900 },
    trades: ['Mason', 'Helper', 'Painter'],
    dayRate: [510, 760],
    note: 'Odisha crews travel to Surat & Chennai. Post-monsoon surge in Oct.',
  },
  {
    id: 'malda',
    name: 'Bengal Migrant Labour Network',
    contact: '+91 97••• ••390',
    city: 'Malda',
    state: 'West Bengal',
    lat: 25.0119,
    lng: 88.1433,
    kind: 'source',
    verified: false,
    rating: 4.1,
    since: 2019,
    pool: { skilled: 640, semiSkilled: 1900, unskilled: 3600 },
    trades: ['Carpenter', 'Painter', 'Helper'],
    dayRate: [480, 740],
    note: 'Finishing trades (carpentry, POP) flow toward Kerala & Bengaluru.',
  },
  {
    id: 'jaipur',
    name: 'Marwar Construction Labour LLP',
    contact: '+91 98••• ••662',
    city: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    kind: 'balanced',
    verified: true,
    rating: 4.6,
    since: 2013,
    pool: { skilled: 1400, semiSkilled: 1800, unskilled: 2200 },
    trades: ['Mason', 'Operator', 'Bar bender', 'Helper'],
    dayRate: [560, 900],
    note: 'Both a source and a demand node — infra projects absorb local supply.',
  },
  {
    id: 'guwahati',
    name: 'Brahmaputra Labour Collective',
    contact: '+91 96••• ••085',
    city: 'Guwahati',
    state: 'Assam',
    lat: 26.1445,
    lng: 91.7362,
    kind: 'source',
    verified: false,
    rating: 4.0,
    since: 2020,
    pool: { skilled: 420, semiSkilled: 980, unskilled: 2100 },
    trades: ['Helper', 'Mason', 'Painter'],
    dayRate: [500, 760],
    note: 'Emerging North-East corridor; verification in progress.',
  },
  {
    id: 'raipur',
    name: 'Chhattisgarh Shram Seva',
    contact: '+91 90••• ••417',
    city: 'Raipur',
    state: 'Chhattisgarh',
    lat: 21.2514,
    lng: 81.6296,
    kind: 'source',
    verified: true,
    rating: 4.2,
    since: 2017,
    pool: { skilled: 690, semiSkilled: 1400, unskilled: 2600 },
    trades: ['Bar bender', 'Helper', 'Operator'],
    dayRate: [520, 780],
    note: 'Central corridor supplying Pune, Hyderabad & Nagpur belts.',
  },

  // ---- Demand hubs (builders sourcing labour — deficit) ----
  {
    id: 'mumbai',
    name: 'Mumbai Metro Builders Guild',
    contact: '+91 22••• ••900',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.076,
    lng: 72.8777,
    kind: 'demand',
    verified: true,
    rating: 4.8,
    since: 2010,
    pool: { skilled: 300, semiSkilled: 220, unskilled: 140 },
    trades: ['Mason', 'Bar bender', 'Shuttering', 'Operator'],
    dayRate: [780, 1250],
    note: 'Highest structural demand nationally. Deficit widens Nov–Feb.',
  },
  {
    id: 'delhi',
    name: 'NCR Infra Contractors Assn.',
    contact: '+91 11••• ••560',
    city: 'Delhi NCR',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.209,
    kind: 'demand',
    verified: true,
    rating: 4.7,
    since: 2009,
    pool: { skilled: 410, semiSkilled: 260, unskilled: 180 },
    trades: ['Mason', 'Carpenter', 'Bar bender', 'Helper'],
    dayRate: [720, 1150],
    note: 'Absorbs Bihar & eastern-UP flows. Peak demand around Diwali handovers.',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Realty Workforce Hub',
    contact: '+91 80••• ••334',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    kind: 'demand',
    verified: true,
    rating: 4.6,
    since: 2012,
    pool: { skilled: 260, semiSkilled: 190, unskilled: 120 },
    trades: ['Carpenter', 'Painter', 'Electrician', 'Plumber'],
    dayRate: [760, 1200],
    note: 'Finishing-trade heavy. Sources from Jharkhand, Odisha & Bengal.',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad Construction Council',
    contact: '+91 40••• ••221',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.385,
    lng: 78.4867,
    kind: 'demand',
    verified: true,
    rating: 4.5,
    since: 2013,
    pool: { skilled: 240, semiSkilled: 170, unskilled: 130 },
    trades: ['Mason', 'Bar bender', 'Operator', 'Helper'],
    dayRate: [700, 1120],
    note: 'Fast-growing demand from Chhattisgarh & MP corridors.',
  },
  {
    id: 'surat',
    name: 'Surat Developers Manpower Desk',
    contact: '+91 26••• ••778',
    city: 'Surat',
    state: 'Gujarat',
    lat: 21.1702,
    lng: 72.8311,
    kind: 'demand',
    verified: true,
    rating: 4.4,
    since: 2014,
    pool: { skilled: 210, semiSkilled: 160, unskilled: 90 },
    trades: ['Mason', 'Helper', 'Painter'],
    dayRate: [740, 1160],
    note: 'Classic Odisha → Surat corridor. Deficit sharpest post-Holi.',
  },
  {
    id: 'chennai',
    name: 'Chennai Builders Labour Exchange',
    contact: '+91 44••• ••045',
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    kind: 'demand',
    verified: true,
    rating: 4.5,
    since: 2011,
    pool: { skilled: 230, semiSkilled: 150, unskilled: 100 },
    trades: ['Mason', 'Bar bender', 'Painter', 'Helper'],
    dayRate: [720, 1140],
    note: 'Draws Assam & Odisha crews. Cyclone season disrupts inflow.',
  },
  {
    id: 'pune',
    name: 'Pune Realty Contractors Forum',
    contact: '+91 20••• ••612',
    city: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    kind: 'demand',
    verified: true,
    rating: 4.6,
    since: 2012,
    pool: { skilled: 250, semiSkilled: 180, unskilled: 110 },
    trades: ['Carpenter', 'Shuttering', 'Electrician', 'Helper'],
    dayRate: [760, 1180],
    note: 'MP & Chhattisgarh corridors feed Pune’s IT-park construction.',
  },
  {
    id: 'kochi',
    name: 'Kerala Coastal Builders Network',
    contact: '+91 48••• ••309',
    city: 'Kochi',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    kind: 'demand',
    verified: true,
    rating: 4.3,
    since: 2015,
    pool: { skilled: 190, semiSkilled: 120, unskilled: 70 },
    trades: ['Carpenter', 'Painter', 'Plumber', 'Helper'],
    dayRate: [820, 1300],
    note: 'Highest wages in the south; long-haul inflow from Bengal & Odisha.',
  },
];

export const FLOWS: Flow[] = [
  { from: 'patna', to: 'delhi', workers: 4200, trend: 'rising' },
  { from: 'patna', to: 'mumbai', workers: 3100, trend: 'steady' },
  { from: 'gorakhpur', to: 'mumbai', workers: 3800, trend: 'rising' },
  { from: 'gorakhpur', to: 'delhi', workers: 2600, trend: 'steady' },
  { from: 'ranchi', to: 'bengaluru', workers: 2200, trend: 'rising' },
  { from: 'ranchi', to: 'hyderabad', workers: 1500, trend: 'steady' },
  { from: 'bhubaneswar', to: 'surat', workers: 2900, trend: 'rising' },
  { from: 'bhubaneswar', to: 'chennai', workers: 1600, trend: 'cooling' },
  { from: 'malda', to: 'kochi', workers: 1800, trend: 'rising' },
  { from: 'malda', to: 'bengaluru', workers: 1400, trend: 'steady' },
  { from: 'raipur', to: 'pune', workers: 1700, trend: 'steady' },
  { from: 'raipur', to: 'hyderabad', workers: 1300, trend: 'rising' },
  { from: 'guwahati', to: 'chennai', workers: 900, trend: 'rising' },
  { from: 'jaipur', to: 'surat', workers: 1200, trend: 'steady' },
];

export const TRADES: Trade[] = [
  'Mason',
  'Bar bender',
  'Carpenter',
  'Shuttering',
  'Painter',
  'Electrician',
  'Plumber',
  'Helper',
  'Operator',
];

// Derived helpers ----------------------------------------------------------

export const poolTotal = (p: WorkerPool) => p.skilled + p.semiSkilled + p.unskilled;

export const brokerById = (id: string) => BROKERS.find((b) => b.id === id);

export const totals = () => {
  const workers = BROKERS.reduce((sum, b) => sum + poolTotal(b.pool), 0);
  const states = new Set(BROKERS.map((b) => b.state)).size;
  const verified = BROKERS.filter((b) => b.verified).length;
  const movement = FLOWS.reduce((s, f) => s + f.workers, 0);
  return { workers, states, verified, brokers: BROKERS.length, movement };
};
