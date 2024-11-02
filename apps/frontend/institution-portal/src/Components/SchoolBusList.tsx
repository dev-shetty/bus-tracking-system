import React from 'react';
import { useState } from 'react';
import BusDetail from './BusDetail';

interface Bus {
  id: string;
  route: string;
  status: string;
  driver: string;
}

const SchoolBusList: React.FC = () => {
    const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const buses: Bus[] = [
    { id: 'KA19A0001', route: 'Ullal', status: 'Running', driver: 'Ramesh Kumar' },
    { id: 'KA19A0002', route: 'Kateel', status: 'Running', driver: 'Suresh Kumar' },
    { id: 'KA19A0003', route: 'Bantwal', status: 'Running', driver: 'Dinesh A' },
  ];

  return (
    <div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {buses.map((bus) => (
        <div key={bus.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-green-300 self-start" />
            <div className="flex-1">
              <h3 className="font-semibold">{bus.id}</h3>
              <p className="text-sm text-gray-600">Route: {bus.route}</p>
              <p className="text-sm text-gray-600">Current Status: {bus.status}</p>
              <p className="text-sm text-gray-600">{bus.driver}</p>
            </div>
            <button onClick={() => setSelectedBus(bus.id)} className="px-3 py-1 bg-black text-white rounded-md text-sm">
              View
            </button>
          </div>
        </div>
      ))}
      </div>
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