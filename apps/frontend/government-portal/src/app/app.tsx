import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Menubar from '../Components/Menubar';
import CollegeList from '../Components/CollegeList';
import InstitutionDashboard from '../Components/InstitutionDashboard';
import AddCollege from '../Components/AddCollege';
import GovernmentLogin from '../Components/GovernmentLogin';
import GovernmentRegister from '../Components/GovernmentRegister';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('accessToken')
  );

  // Sync authentication state with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('accessToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/portal" /> : <GovernmentLogin />
        }
      />

      {/* Register Route */}
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/portal" /> : <GovernmentRegister />
        }
      />

      {/* Authenticated Routes */}
      <Route
        path="/portal/*"
        element={
          isAuthenticated ? (
            <div className="min-h-screen bg-gray-50">
              <header className="border-b bg-white relative">
                <div className="flex h-16 items-center px-4">
                  <Menubar />
                  <div className="flex items-center pl-9">
                    <h1 className="text-xl font-bold">
                      Bus Tracker - Government Portal
                    </h1>
                  </div>
                </div>
              </header>

              <main className="container mx-auto p-4">
                <Routes>
                  <Route path="/" element={<CollegeList />} />
                  <Route
                    path="institution/:id"
                    element={<InstitutionDashboard />}
                  />
                  <Route path="add-college" element={<AddCollege />} />
                  <Route
                    path="notifications"
                    element={<div>Notifications Page</div>}
                  />
                </Routes>
              </main>
            </div>
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default App;
