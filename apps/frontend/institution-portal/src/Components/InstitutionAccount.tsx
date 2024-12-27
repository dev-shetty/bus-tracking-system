import React from 'react';
import { useNavigate } from 'react-router-dom';

interface InstitutionAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstitutionAccount: React.FC<InstitutionAccountProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/', {
      replace: true,
    });
    window.location.reload();
  };

  return (
    <div
      className="absolute top-16 right-4 z-50 w-[500px] bg-white rounded-lg border-t-2 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0 w-48 h-60 bg-gradient-to-b from-pink-500 to-purple-600 rounded-lg p-4 text-white flex flex-col items-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-purple-600 font-semibold mb-4">
              SF
            </div>
            <h2 className="text-xl font-bold mb-2">Sahyadri</h2>
            <p className="text-sm text-white/90 text-center">
              Sahyadri College Of Engineering and Management, Adyar, Mangaluru,
              575005
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1">
              Institution Allied with
            </h3>
            <p className="text-gray-900">
              Mangaluru City Corporation, Ballalbagh, Mangaluru
            </p>

            <button
              className="m-10 bg-slate-200 px-5 py-2 rounded-md hover:bg-gray-400 duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionAccount;
