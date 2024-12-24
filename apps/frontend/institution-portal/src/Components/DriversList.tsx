import React, { useEffect, useState } from 'react';

interface Driver {
  name: string;
  busNo: number; // Adjusted to match your bus table
  mobile: string;
}

const DriversList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/buses/drivers');
        if (!response.ok) {
          throw new Error('Failed to fetch drivers');
        }
        const data = await response.json();
        setDrivers(data); // Assumes API returns an array of driver objects
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3 mx-20">
      {drivers.map((driver, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-pink-200 self-start" />
            <div className="flex-1">
              <h3 className="font-semibold">{driver.name}</h3>
              <p className="text-sm text-gray-600">Bus No: {driver.busNo}</p>
              <p className="text-sm text-gray-600">Mobile: {driver.mobile}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriversList;
