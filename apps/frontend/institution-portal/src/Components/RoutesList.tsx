import React, { useEffect, useState } from 'react';

interface Route {
  id: number;
  busId: string;
  sourceLatitude: number;
  sourceLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  stops: string[]; // Assuming stops are also provided by the API
}

const RoutesList: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/buses/routes');
        if (!response.ok) {
          throw new Error('Failed to fetch routes');
        }
        const data: Route[] = await response.json();
        setRoutes(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return <div>Loading routes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3 mx-20">
      {routes.map((route) => (
        <div key={route.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-yellow-200" />
            <div>
              <h3 className="font-semibold">Route ID: {route.id}</h3>
              <p className="text-sm text-gray-600">Bus: {route.busId}</p>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Source & Destination</h4>
            <p className="text-sm">Source: ({route.sourceLatitude}, {route.sourceLongitude})</p>
            <p className="text-sm">Destination: ({route.destinationLatitude}, {route.destinationLongitude})</p>
          </div>
          {route.stops && (
            <div>
              <h4 className="mt-4 mb-2 font-medium">Pickup/Drop Points</h4>
              <div className="divide-y rounded-md border">
                {route.stops.map((stop, index) => (
                  <div key={index} className="px-3 py-2 text-sm">
                    {stop}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoutesList;
