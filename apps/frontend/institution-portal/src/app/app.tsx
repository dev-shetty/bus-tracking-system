import React, { useState } from 'react';
import Menubar from '../Components/Menubar';
import SchoolBusList from '../Components/SchoolBusList';
import RoutesList from '../Components/RoutesList';
import DriversList from '../Components/DriversList';
import InstitutionAccount from '../Components/InstitutionAccount';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'buses' | 'routes' | 'drivers'>('buses');
  const [isInstitutionOpen, setIsInstitutionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white relative">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="flex items-center">
            <Menubar activeView={activeView} setActiveView={setActiveView} />
            <h1 className="text-xl font-bold">Bus Tracker - Institution Portal</h1>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInstitutionOpen(!isInstitutionOpen);
            }}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium hover:bg-gray-300"
          >
            SF
          </button>
        </div>
        <InstitutionAccount 
          isOpen={isInstitutionOpen} 
          onClose={() => setIsInstitutionOpen(false)} 
        />
      </header>

      <main className="container mx-auto p-4">
        {activeView === 'buses' && <SchoolBusList />}
        {activeView === 'routes' && <RoutesList />}
        {activeView === 'drivers' && <DriversList />}
      </main>
    </div>
  );
};

export default App;