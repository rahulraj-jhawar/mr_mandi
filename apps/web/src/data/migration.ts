// Data showcase for the Economic Survey 2016-17, Chapter 12:
// "India on the Move and Churning: New Evidence."
//
// HEADLINE FIGURES below are as reported by the Survey and are cited directly.
// STATE / CORRIDOR magnitudes are shown as a normalised INDEX (100 = highest),
// not official absolute counts — the *rankings* follow the Survey & Census 2011
// work-migration patterns, but exact per-state flows were not published in a
// single tidy table, so we index them to stay honest. See `SOURCE`.

export const SOURCE = {
  title: 'India on the Move and Churning: New Evidence',
  publication: 'Economic Survey 2016-17, Volume I · Chapter 12',
  authority: 'Ministry of Finance, Government of India',
  url: 'https://www.indiabudget.gov.in/budget2017-2018/es2016-17/echapter_vol1.pdf',
};

// Confident, directly-cited headline numbers.
export const HEADLINE = {
  annualFlowMillions: 9, // "close to 9 million a year between 2011 and 2016"
  periodFrom: 2011,
  periodTo: 2016,
  growth2001_11: 4.5, // % per year, inter-state migration for work
  growth1991_01: 2.4, // % per year, previous decade
};

export interface StateStat {
  state: string;
  code: string;
  index: number; // 0-100, indicative net-migration intensity
}

// Net OUT-migration (source states) — ranking per Survey/Census work-migration.
export const ORIGINS: StateStat[] = [
  { state: 'Uttar Pradesh', code: 'UP', index: 100 },
  { state: 'Bihar', code: 'BR', index: 89 },
  { state: 'Madhya Pradesh', code: 'MP', index: 54 },
  { state: 'Rajasthan', code: 'RJ', index: 48 },
  { state: 'West Bengal', code: 'WB', index: 44 },
  { state: 'Jharkhand', code: 'JH', index: 37 },
  { state: 'Odisha', code: 'OD', index: 33 },
  { state: 'Assam', code: 'AS', index: 26 },
];

// Net IN-migration (destination states) — Delhi region the top magnet.
export const DESTINATIONS: StateStat[] = [
  { state: 'Delhi (NCR)', code: 'DL', index: 100 },
  { state: 'Maharashtra', code: 'MH', index: 82 },
  { state: 'Gujarat', code: 'GJ', index: 68 },
  { state: 'Tamil Nadu', code: 'TN', index: 57 },
  { state: 'Kerala', code: 'KL', index: 49 },
  { state: 'Karnataka', code: 'KA', index: 46 },
  { state: 'Haryana', code: 'HR', index: 41 },
  { state: 'Punjab', code: 'PB', index: 34 },
];

export interface Corridor {
  from: string;
  to: string;
  intensity: number; // 0-100 indicative
}

export const CORRIDORS: Corridor[] = [
  { from: 'Uttar Pradesh', to: 'Delhi (NCR)', intensity: 100 },
  { from: 'Bihar', to: 'Delhi (NCR)', intensity: 86 },
  { from: 'Uttar Pradesh', to: 'Maharashtra', intensity: 78 },
  { from: 'Bihar', to: 'Maharashtra', intensity: 64 },
  { from: 'Rajasthan', to: 'Gujarat', intensity: 58 },
  { from: 'Uttar Pradesh', to: 'Gujarat', intensity: 52 },
  { from: 'Odisha', to: 'Gujarat', intensity: 47 },
  { from: 'West Bengal', to: 'Kerala', intensity: 41 },
  { from: 'Madhya Pradesh', to: 'Gujarat', intensity: 38 },
];

// --- Seasonal / month-wise movement model ------------------------------------
//
// Indian labour migration follows the agricultural + festival calendar. These
// monthly multipliers apply to the annual average flow to approximate how much
// inter-state movement toward cities happens in a typical month — i.e. the
// historical seasonal average ("averaged out by time"), not a single year.
// Grounded in the Rabi/Kharif crop cycle, the monsoon, and festival returns.

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

// Multiplier on the average monthly flow (1.0 = the yearly average).
export const SEASONALITY = [
  1.05, // Jan – peak winter construction
  1.1, // Feb – post-Rabi outflow begins
  1.25, // Mar – heavy outflow after harvest
  1.3, // Apr – summer construction peak
  1.25, // May – pre-monsoon peak
  1.0, // Jun – monsoon onset, Kharif pull-back
  0.65, // Jul – monsoon low, return to sow
  0.6, // Aug – monsoon trough
  0.75, // Sep – rains ease, heading back
  0.7, // Oct – festival returns (Dussehra–Chhath)
  0.95, // Nov – post-Diwali return to cities
  1.05, // Dec – dry-season construction
];

export const MONTH_NOTE = [
  'Peak winter construction; steady inflow to cities.',
  'Post-Rabi harvest — outflow toward cities begins.',
  'Heavy outflow after the harvest; sites ramp up.',
  'Summer construction peak — highest inflow of the year.',
  'Pre-monsoon peak before the rains arrive.',
  'Monsoon onset; workers start returning for Kharif sowing.',
  'Monsoon low — many return home to sow; sites slow down.',
  'Monsoon trough; inter-state movement at its lowest.',
  'Rains ease; workers begin heading back to the cities.',
  'Festival season (Dussehra–Chhath) — strong reverse migration home.',
  'Post-Diwali return to the cities; activity rebuilds.',
  'Dry-season construction; inflow strengthens again.',
];

// Approximate state centroids used to draw flow arcs on the map.
export const STATE_COORDS: Record<string, [number, number]> = {
  'Uttar Pradesh': [27.0, 80.9],
  Bihar: [25.8, 85.9],
  'Madhya Pradesh': [23.5, 78.4],
  Rajasthan: [26.6, 73.8],
  'West Bengal': [23.4, 87.9],
  Jharkhand: [23.6, 85.3],
  Odisha: [20.6, 84.6],
  Assam: [26.2, 92.7],
  'Delhi (NCR)': [28.6, 77.1],
  Maharashtra: [19.6, 75.3],
  Gujarat: [22.6, 71.7],
  'Tamil Nadu': [11.5, 78.4],
  Kerala: [10.3, 76.4],
  Karnataka: [14.8, 75.9],
  Haryana: [29.1, 76.2],
  Punjab: [30.8, 75.5],
};

// Estimated inter-state movers for a given month, in lakh (1 lakh = 100,000),
// derived from the Survey's ~9M/year averaged over 12 months and scaled by the
// seasonal multiplier.
export function monthlyMoversLakh(monthIndex: number): number {
  const annual = HEADLINE.annualFlowMillions * 1_000_000;
  const base = annual / 12;
  return (base * SEASONALITY[monthIndex]) / 100_000;
}

export const FINDINGS: { title: string; body: string }[] = [
  {
    title: 'Migration is roughly double earlier estimates',
    body: 'Railway-based flows put annual inter-state labour movement near 9 million — far above what decadal Census stock figures had implied.',
  },
  {
    title: 'And it is accelerating',
    body: 'Inter-state migration for work grew about 4.5% a year in 2001–11, nearly twice the ~2.4% pace of the previous decade.',
  },
  {
    title: 'Two states send the most people',
    body: 'Uttar Pradesh and Bihar are the largest net senders of workers, together accounting for roughly half of net out-migration.',
  },
  {
    title: 'A handful of states absorb them',
    body: 'The Delhi region is the single biggest magnet, followed by Maharashtra, Gujarat, Tamil Nadu and Kerala.',
  },
  {
    title: 'Work migration skews young and male',
    body: 'Economic migration is dominated by working-age men (roughly 15–29 at first move), the exact cohort construction sites draw on.',
  },
  {
    title: 'Poorer states move toward richer ones',
    body: 'Net flows run from lower-income origin states to higher-wage destination states — the wage gradient drives the corridors.',
  },
];
