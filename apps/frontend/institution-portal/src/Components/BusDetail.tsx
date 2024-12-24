import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AddNewStudentToBus from './AddNewStudentToBus'; // Import the AddNewStudentToBus component

interface Student {
  id: number;
  name: string;
  residence: string;
  parentContact: string;
  pickupLocation: string;
}

interface BusDetailProps {
  busId: string;
  onClose: () => void;
}

const BusDetail: React.FC<BusDetailProps> = ({ busId, onClose }) => {
  const [showMap, setShowMap] = useState(true);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3000/api/buses/${busId}/students`);
        if (!response.ok) {
          throw new Error(`Failed to fetch students for bus ID: ${busId}`);
        }
        const data = await response.json();
        const formattedStudents = data.map((student: any) => ({
          id: student.id,
          name: student.name,
          residence: `${student.home_latitude}, ${student.home_longitude}`, // Convert latitude and longitude to residence
          parentContact: 'Not Available', // Assuming parent contact is not part of the data schema
          pickupLocation: 'Not Available', // Assuming pickup location is not part of the data schema
        }));
        setStudents(formattedStudents);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [busId]);

  const busDetails = {
    from: 'Sahyadri',
    to: 'Ullal',
    departureTime: '8:00 AM',
    speed: '40 km/h',
    numberOfStudents: students.length.toString(),
    driver: 'Ramesh Kumar',
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 border-r p-6 bg-gray-50">
          <h2 className="text-xl font-bold mb-6">{busId}</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">From:</p>
              <p className="font-medium">{busDetails.from}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To:</p>
              <p className="font-medium">{busDetails.to}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Departure Time:</p>
              <p className="font-medium">{busDetails.departureTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Speed:</p>
              <p className="font-medium">{busDetails.speed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">No. of students:</p>
              <p className="font-medium">{busDetails.numberOfStudents}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver:</p>
              <p className="font-medium">{busDetails.driver}</p>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="w-full bg-black text-white rounded-md py-2 px-4 text-sm"
            >
              {showMap ? 'View Students List' : 'View Bus Location'}
            </button>
            <button
              onClick={() => setShowAddStudentForm(!showAddStudentForm)}
              className="w-full bg-black text-white rounded-md py-2 px-4 text-sm mt-4"
            >
              {showAddStudentForm ? 'Hide Add Student Form' : 'Add New Student'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-14 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button>

          {showAddStudentForm ? (
            <AddNewStudentToBus busId={busId} />
          ) : showMap ? (
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">Map will be implemented here</p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto mb-4">
              {loading ? (
                <p>Loading students...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Student Name</th>
                      <th className="text-left py-4 px-4">Residence Location</th>
                      <th className="text-left py-4 px-4">Parent Contact</th>
                      <th className="text-left py-4 px-4">
                        Pickup/Drop Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="py-4 px-4">{student.name}</td>
                        <td className="py-4 px-4">{student.residence}</td>
                        <td className="py-4 px-4">{student.parentContact}</td>
                        <td className="py-4 px-4">{student.pickupLocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetail;
