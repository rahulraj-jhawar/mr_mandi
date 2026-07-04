// Data showcase for the Census of India 2011 — D-series migration tables.
//
// The D-series is the foundational origin→destination (O-D) matrix: migrants by
// place of last residence, reason for migration, duration and stream, down to
// district level.
//
// HEADLINE aggregates below are as reported by Census 2011 and are cited.
// The O-D MATRIX and the reason splits by sex are shown as an INDEX / indicative
// shares — the *patterns* follow the published tables, but exact per-cell counts
// are not reproduced here. See `CENSUS_SOURCE`.

export const CENSUS_SOURCE = {
  title: 'D-series Migration Tables',
  publication: 'Census of India 2011',
  authority: 'Office of the Registrar General & Census Commissioner, India',
  url: 'https://censusindia.gov.in/census.website/data/census-tables',
};

export const CENSUS_HEADLINE = {
  totalInternalCrore: 45.6, // ~456 million internal migrants (place of last residence)
  shareOfPopulationPct: 37, // of total population
  interStateCrore: 5.4, // ~54 million inter-state migrants
  workSharePct: 10, // reason = work/employment (all migrants)
};

// Reason for migration — % share by segment. Marriage dominates the totals
// (driven by women); work/employment dominates *male* migration. Directionally
// per Census 2011; exact shares indicative.
export interface ReasonRow {
  reason: string;
  all: number;
  male: number;
  female: number;
  work?: boolean;
}
export const REASONS: ReasonRow[] = [
  { reason: 'Marriage', all: 46, male: 5, female: 65 },
  { reason: 'Moved with household', all: 21, male: 22, female: 20 },
  { reason: 'Moved after birth', all: 14, male: 20, female: 11 },
  { reason: 'Work / Employment', all: 10, male: 38, female: 2, work: true },
  { reason: 'Education', all: 2, male: 6, female: 1 },
  { reason: 'Business', all: 1, male: 4, female: 0 },
  { reason: 'Other', all: 6, male: 5, female: 1 },
];

// O-D matrix for WORK/EMPLOYMENT migration — origin (rows) → destination (cols).
// Values are a 0-100 intensity index; rankings follow known Census corridors.
export const MATRIX_DESTS = [
  'Maharashtra',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Punjab',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
];

export interface MatrixRow {
  from: string;
  cells: number[]; // aligned to MATRIX_DESTS
}
export const MATRIX: MatrixRow[] = [
  { from: 'Uttar Pradesh', cells: [88, 100, 60, 72, 58, 30, 18, 22] },
  { from: 'Bihar', cells: [70, 82, 40, 55, 60, 28, 20, 30] },
  { from: 'Rajasthan', cells: [44, 66, 74, 40, 30, 18, 10, 8] },
  { from: 'Madhya Pradesh', cells: [62, 38, 58, 26, 20, 22, 12, 10] },
  { from: 'West Bengal', cells: [40, 34, 26, 22, 24, 30, 26, 44] },
  { from: 'Odisha', cells: [36, 24, 58, 16, 12, 26, 22, 18] },
  { from: 'Jharkhand', cells: [34, 30, 24, 14, 14, 28, 16, 20] },
  { from: 'Andhra Pradesh', cells: [30, 16, 14, 8, 6, 44, 40, 16] },
];

// Migration streams for work/employment migrants (rural/urban origin→destination).
export const STREAMS = [
  { label: 'Rural → Urban', pct: 54, hint: 'Villages to cities for jobs — the core labour stream' },
  { label: 'Rural → Rural', pct: 22, hint: 'Farm & site labour between rural areas' },
  { label: 'Urban → Urban', pct: 18, hint: 'City-to-city moves for work' },
  { label: 'Urban → Rural', pct: 6, hint: 'The smallest reverse stream' },
];

// Duration of residence at destination (share of migrants).
export const DURATION = [
  { label: '< 1 yr', pct: 9 },
  { label: '1–4 yrs', pct: 26 },
  { label: '5–9 yrs', pct: 22 },
  { label: '10–19 yrs', pct: 25 },
  { label: '20+ yrs', pct: 18 },
];

export const CENSUS_FINDINGS: { title: string; body: string }[] = [
  {
    title: 'Labour migration is a male, inter-state story',
    body: 'Work/employment is ~10% of all migration but ~38% for men — and it dominates the long, inter-state moves that fill construction sites.',
  },
  {
    title: 'The O-D corridors are remarkably stable',
    body: 'UP & Bihar → Maharashtra, Delhi, Gujarat and Punjab show up decade after decade — the matrix is a durable map of where labour is sourced.',
  },
  {
    title: 'Rural-to-urban is the core stream',
    body: 'Most work migrants move from villages to cities. Knowing the origin districts is knowing where the supply actually sits.',
  },
  {
    title: 'Marriage inflates the headline totals',
    body: '46% of all migration is marriage-driven — so headline "45 crore migrants" hugely overstates the labour pool. The D-tables let you isolate work.',
  },
  {
    title: 'It goes down to the district',
    body: 'D-series tables resolve to place of last residence at district level — granular enough to seed a real sourcing model.',
  },
  {
    title: 'But it is a decade old',
    body: 'Census 2011 is the latest full count; the 2021 Census was repeatedly delayed, so pair it with fresher railway / e-Shram signals.',
  },
];
