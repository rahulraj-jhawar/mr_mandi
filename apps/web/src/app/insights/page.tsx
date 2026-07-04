import type { Metadata } from 'next';
import OurInsights from '../../components/OurInsights';

export const metadata: Metadata = {
  title: 'Our Insights — the labour-migration data behind Mistri Mandi',
  description:
    'The research behind Mistri Mandi in one place: the Economic Survey 2016-17 “India on the Move” findings (~9M inter-state migrants a year, the Cohort-Based Migration Metric, source & destination states, corridors, seasonality) and the Census 2011 D-series origin–destination matrix, reason-for-migration and streams.',
  alternates: { canonical: '/insights' },
};

export default function InsightsPage() {
  return <OurInsights />;
}
