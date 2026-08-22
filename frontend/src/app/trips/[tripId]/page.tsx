interface TripDetailsPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export default async function TripDetailsPage({ params }: TripDetailsPageProps) {
  const { tripId } = await params;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Trip Itinerary</h1>
      <p className="text-slate-600">Trip ID: {tripId}</p>
    </div>
  );
}
