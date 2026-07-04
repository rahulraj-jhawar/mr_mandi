import type { Metadata } from 'next';
import Census from '../../components/Census';

export const metadata: Metadata = {
  title: 'Census 2011 D-series // India’s migration origin–destination matrix — Mr. Mandi',
  description:
    'A data showcase of the Census of India 2011 D-series migration tables: ~45.6 crore internal migrants, reason for migration by sex, the state-to-state work-migration origin–destination matrix, streams and duration.',
};

export default function Census2011Page() {
  return <Census />;
}
