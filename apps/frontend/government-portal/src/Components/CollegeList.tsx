import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface College {
  id: string;
  name: string;
  contact: string;
  latitude: string;
  longitude: string;
}

const CollegeCard: React.FC<College & { onClick: () => void }> = ({ name, contact, latitude, longitude, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-b from-pink-500 to-purple-600 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
    >
      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-purple-600 font-semibold mb-4">
        {name[0].toUpperCase()} {/* First letter of the college name */}
      </div>
      <h2 className="text-white text-xl font-semibold mb-2">{name}</h2>
      <p className="text-white/90 text-sm">Contact: {contact}</p>
      <p className="text-white/90 text-sm">Lat: {latitude}, Long: {longitude}</p>
    </div>
  );
};

const CollegeList: React.FC = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token is missing. Please log in.");
        }
        const response = await fetch(
          `http://localhost:3000/api/institutions`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setColleges(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Use the error message if it's an instance of Error
        } else {
          setError('An unknown error occurred'); // Fallback for non-Error types
        }
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/portal/institution/${collegeId}`);
  };

  if (loading) return <p>Loading colleges...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {colleges.map((college) => (
          <CollegeCard
            key={college.id}
            {...college}
            onClick={() => handleCollegeClick(college.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CollegeList;
