async function getApiHealth() {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${base}/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return (await res.json()) as { status: string; service: string };
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getApiHealth();

  return (
    <main style={{ maxWidth: 640, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1>Mr Mandi</h1>
      <p>Turborepo · Next.js frontend · NestJS backend</p>
      <h2 style={{ marginTop: '2rem' }}>API status</h2>
      {health ? (
        <pre style={{ background: '#f4f4f5', padding: '1rem', borderRadius: 8 }}>
          {JSON.stringify(health, null, 2)}
        </pre>
      ) : (
        <p style={{ color: '#b91c1c' }}>
          Could not reach the API. Is it running on http://localhost:3001?
        </p>
      )}
    </main>
  );
}
