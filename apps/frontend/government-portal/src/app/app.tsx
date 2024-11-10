import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CollegeList from '../Components/CollegeList';
import InstitutionDashboard from '../Components/InstitutionDashboard';
import Menubar from '../Components/Menubar';
import AddCollege from '../Components/AddCollege';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white relative">
        <div className="flex h-16 items-center px-4 justify-between">
          <Menubar/>
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Bus Tracker</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<CollegeList />} />
          <Route path="/institution/:id" element={<InstitutionDashboard />} />
          <Route path="/add-college" element={<AddCollege />} />
          <Route path="/notifications" element={<div>Notifications Page</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;