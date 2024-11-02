import React, { useState } from 'react';
import Menubar from '../Components/Menubar';
import SchoolBusList from '../Components/SchoolBusList';
import RoutesList from '../Components/RoutesList';
import DriversList from '../Components/DriversList';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'buses' | 'routes' | 'drivers'>('buses');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-4">
          <Menubar activeView={activeView} setActiveView={setActiveView} />
          <h1 className="text-xl font-bold">Bus Tracker</h1>
        </div>
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