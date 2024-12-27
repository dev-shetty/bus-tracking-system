import React, { useEffect, useState } from 'react';

interface Stop {
  id: number;
  latitude: string;
  longitude: string;
  address: string;
}

interface Route {
  bus_id: string; // Changed from `busId` to match API response
  stops: Stop[];
}

const RoutesList: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const institutionId = 1;

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:3000/api/institutions/${institutionId}/routes`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
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
        <div key={route.bus_id} className="bg-white rounded-lg shadow-md p-4">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-yellow-200" />
            <div>
              <h3 className="font-semibold">Bus ID: {route.bus_id}</h3>
            </div>
          </div>

          {/* Loop through the stops for this route */}
          <div>
            <h4 className="mb-2 font-medium">Stops</h4>
            {route.stops.map((stop) => (
              <div key={stop.id} className="mb-4">
                <p className="text-sm text-gray-600">Address: {stop.address}</p>
                <p className="text-sm">
                  Coordinates: ({stop.latitude}, {stop.longitude})
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoutesList;
