import React, { useEffect, useState } from 'react';

interface Route {
  id: number;
  busId: string;
  latitude: string;
  longitude: string;
  address: string; // Assuming stops are also provided by the API
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
            <h4 className="mb-2 font-medium">Address</h4>
            <p className="text-sm">Coordinates: ({route.latitude}, {route.longitude})</p>
            <p className="text-sm">Coordinates: ({route.address}, {route.longitude})</p>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default RoutesList;
