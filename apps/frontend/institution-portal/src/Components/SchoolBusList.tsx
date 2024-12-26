import React, { useState, useEffect } from 'react';
import BusDetail from './BusDetail';

const apiLink = import.meta.env.VITE_API_LINK;

interface Bus {
  id: string;
  institution_id: number;
  driver_id: number;
  device_id: string;
}

const SchoolBusList: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const institutionId = 1; // Replace this with the actual institution ID, if dynamic

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/api/buses/buses/${institutionId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch buses: ${response.status} ${response.statusText}`);
        }
        const data: Bus[] = await response.json();

        setBuses(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching buses.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [institutionId]);

  return (
    <div>
      {loading && <p>Loading buses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3 mx-20">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-white rounded-lg shadow-md p-4">

              <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-green-300 self-start" />
                <div className="flex-1">
                  <h3 className="font-semibold">Bus ID: {bus.id}</h3>
                  <p className="text-sm text-gray-600">Institution ID: {bus.institution_id}</p>
                  <p className="text-sm text-gray-600">Driver ID: {bus.driver_id}</p>
                  <p className="text-sm text-gray-600">Device ID: {bus.device_id}</p>
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
      )}
      {selectedBus && (
        <BusDetail
          busId={selectedBus}
          onClose={() => setSelectedBus(null)}
        />
      )}
    </div>
  );
};

export default SchoolBusList;
