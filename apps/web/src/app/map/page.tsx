import type { Metadata } from 'next';
import App from '../../components/App';

export const metadata: Metadata = {
  title: 'Labour Chowk — verified labour brokers on a live map of India',
  description:
    'Browse verified labour brokers across India on Labour Chowk. See profiles, ratings, reviews and sourcing metrics; filter by trade & skill; toggle predictable seasonal labour flows; and post a requirement to source skilled, semi-skilled & unskilled construction workers.',
  alternates: { canonical: '/map' },
};

export default function MapPage() {
  return <App />;
}
