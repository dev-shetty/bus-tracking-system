import React from 'react';

interface Route {
  name: string;
  busId: string;
  stops: string[];
}

const RoutesList: React.FC = () => {
  const routes: Route[] = [
    {
      name: 'Sahyadri to Ullal',
      busId: 'KA19A0001',
      stops: ['Adyar', 'Kannur', 'Padil', 'Pumpwell', 'Thokkottu', 'Ullal']
    },
    {
      name: 'Sahyadri to Kateel',
      busId: 'KA19A0002',
      stops: ['Adyar', 'Kannur', 'Padil', 'Pumpwell', 'Thokkottu', 'Kateel']
    },
    // Add more routes as needed
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {routes.map((route) => (
        <div key={route.busId} className="bg-white rounded-lg shadow-md p-4">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-yellow-200" />
            <div>
              <h3 className="font-semibold">{route.name}</h3>
              <p className="text-sm text-gray-600">Bus: {route.busId}</p>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Pickup/Drop Points</h4>
            <div className="divide-y rounded-md border">
              {route.stops.map((stop) => (
                <div key={stop} className="px-3 py-2 text-sm">
                  {stop}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoutesList;