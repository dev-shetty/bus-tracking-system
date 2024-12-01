import React from 'react';
import { useState, useEffect } from 'react';
import BusDetail from './BusDetail';

const apiLink = import.meta.env.VITE_API_LINK;

interface Bus {
  id: string;
  route: string;
  status: string;
  driver: string;
  latitude: string;
  longitude: string;
}

const SchoolBusList: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const now = Date.now();
      if (now - lastFetchTime < 60000) {
        console.log('Using cached data');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(apiLink);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const vehicleData = data.root.VehicleData;

        const transformedData: Bus[] = vehicleData.map((vehicle: any) => ({
          id: vehicle.Vehicle_No,
          route: vehicle.Location || 'Unknown Route',
          status: vehicle.IGN || 'Unknown Status',
          driver:
            `${vehicle.Driver_First_Name} ${vehicle.Driver_Last_Name}`.trim() ||
            'Unknown Driver',
          latitude: vehicle.Latitude || 'Unknown',
          longitude: vehicle.Longitude || 'Unknown',
        }));

        setBuses(transformedData);
        setLastFetchTime(now);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lastFetchTime]);

  return (
    <div>
      <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3 mx-20">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-4">
              <div
                className={`h-8 w-8 rounded-full ${
                  bus.status === 'ON' ? 'bg-green-300' : 'bg-red-300'
                } self-start`}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{bus.id}</h3>
                <p className="text-sm text-gray-600">Location: {bus.route}</p>
                <p className="text-sm text-gray-600">
                  Current Status: {bus.status}
                </p>
                <p className="text-sm text-gray-600">Driver: Unknown</p>
                <p className="text-sm text-gray-600">
                  Coordinates:
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${bus.latitude}&mlon=${bus.longitude}#map=15/${bus.latitude}/${bus.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {`${bus.latitude}, ${bus.longitude}`}
                  </a>
                </p>
              </div>
              <button
                onClick={() => setSelectedBus(bus.id)}
                className="px-3 py-1 bg-black text-white rounded-md text-sm"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedBus && (
        <BusDetail busId={selectedBus} onClose={() => setSelectedBus(null)} />
      )}
    </div>
  );
};

export default SchoolBusList;
