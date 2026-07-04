import type { Metadata } from 'next';
import Showcase from '../../components/Showcase';

export const metadata: Metadata = {
  title: 'India on the Move // Internal labour migration, visualised — Mr. Mandi',
  description:
    'A data showcase of the Economic Survey 2016-17 “India on the Move” chapter: ~9 million inter-state migrants a year (2011–2016), the Cohort-Based Migration Metric, top source & destination states, and the busiest labour corridors.',
};

export default function IndiaOnTheMovePage() {
  return <Showcase />;
}
