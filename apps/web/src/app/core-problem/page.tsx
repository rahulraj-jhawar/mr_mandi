import type { Metadata } from 'next';
import CoreProblem from '../../components/CoreProblem';

export const metadata: Metadata = {
  title: 'The core problem // India’s construction labour shortage, reframed — Mr. Mandi',
  description:
    'India isn’t short of labour — it’s short of the right connection. The evidence from Census 2011 and the Economic Survey 2016-17, synthesised: supply is abundant and moves on predictable seasonal corridors, but verified sourcing through labour brokers is the missing layer.',
};

export default function CoreProblemPage() {
  return <CoreProblem />;
}
