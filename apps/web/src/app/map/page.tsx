import type { Metadata } from 'next';
import App from '../../components/App';

export const metadata: Metadata = {
  title: 'Live map // Source verified construction labour across India — Mr. Mandi',
  description:
    'Find verified labour brokers to source skilled, semi-skilled & unskilled construction workers on a beautiful map of India. Predicted labour flows, filter by trade & skill, day-rate ranges, ratings & worker pools.',
};

export default function MapPage() {
  return <App />;
}
