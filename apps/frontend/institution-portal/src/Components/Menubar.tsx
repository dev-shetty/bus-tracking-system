import React from 'react';
import { Menu as MenuIcon } from 'lucide-react';

interface MenuProps {
  activeView: 'buses' | 'routes' | 'drivers';
  setActiveView: (view: 'buses' | 'routes' | 'drivers') => void;
}

const Menubar: React.FC<MenuProps> = ({ activeView, setActiveView }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleViewChange = (view: 'buses' | 'routes' | 'drivers') => {
    setActiveView(view);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="mr-4 p-2 rounded-md hover:bg-gray-200"
        aria-label="Toggle menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 mt-16">
          <div className="bg-white w-64 h-full">
            <nav className="flex flex-col gap-4 p-4">
              <button
                className={`text-left px-4 py-2 rounded-md ${activeView === 'buses' ? 'bg-gray-700 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleViewChange('buses')}
              >
                School Bus
              </button>
              <button
                className={`text-left px-4 py-2 rounded-md ${activeView === 'routes' ? 'bg-gray-700 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleViewChange('routes')}
              >
                Routes
              </button>
              <button
                className={`text-left px-4 py-2 rounded-md ${activeView === 'drivers' ? 'bg-gray-700 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleViewChange('drivers')}
              >
                Drivers
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Menubar;