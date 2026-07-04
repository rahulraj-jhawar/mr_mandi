import type { Metadata } from 'next';
import CoreProblem from '../components/CoreProblem';

export const metadata: Metadata = {
  title: 'India isn’t short of labour — it’s short of the right connection',
  description:
    'Construction’s labour shortage is a distribution problem, not a supply problem. Evidence from Census 2011 and the Economic Survey 2016-17: labour is abundant and moves on predictable, seasonal corridors — verified sourcing through labour brokers on Mistri Mandi is the missing layer.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return <CoreProblem />;
}
