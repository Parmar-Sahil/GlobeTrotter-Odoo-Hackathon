interface SharedTripPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function SharedTripPage({ params }: SharedTripPageProps) {
  const { token } = await params;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Shared Itinerary</h1>
      <p className="text-slate-600">Share Token: {token}</p>
    </div>
  );
}
