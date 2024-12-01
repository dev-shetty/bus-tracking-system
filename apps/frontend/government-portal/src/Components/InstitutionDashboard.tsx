import React, { useState } from 'react';
import SchoolBusList from './SchoolBusList';
import RoutesList from './RoutesList';
import DriversList from './DriversList';
import { Routes } from 'react-router-dom';

const InstitutionDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'buses' | 'routes' | 'drivers'>('buses');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto p-4">
        {activeView === 'buses' && <SchoolBusList />}
        {activeView === 'routes' && <RoutesList />}
        {activeView === 'drivers' && <DriversList />}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="container mx-auto flex justify-between gap-4">
          <button
            onClick={() => setActiveView('buses')}
            className={`flex-1 py-2 px-4 rounded-md text-center ${
              activeView === 'buses' 
                ? 'bg-gray-100 text-gray-700' 
                : 'bg-black text-white'
            }`}
          >
            School Bus
          </button>
          <button
            onClick={() => setActiveView('routes')}
            className={`flex-1 py-2 px-4 rounded-md text-center ${
              activeView === 'routes' 
                ? 'bg-gray-100 text-gray-700' 
                : 'bg-black text-white'
            }`}
          >
            Routes
          </button>
          <button
            onClick={() => setActiveView('drivers')}
            className={`flex-1 py-2 px-4 rounded-md text-center ${
              activeView === 'drivers' 
                ? 'bg-gray-100 text-gray-700' 
                : 'bg-black text-white'
            }`}
          >
            Drivers
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;