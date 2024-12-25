import React, { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';
import AddNewStudentToBus from './AddNewStudentToBus';
import EditBusDetails from './EditBusDetails';

interface Student {
  id: number;
  name: string;
  usn: string;
  home_latitude: string;
  home_longitude: string
  home_address: string;
}

interface BusDetailProps {
  busId: string;
  
  onClose: () => void;
}

const BusDetail: React.FC<BusDetailProps> = ({ busId, onClose }) => {
  const [showMap, setShowMap] = useState(true);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [busDetails, setBusDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3000/api/buses/${busId}`);
        if (!response.ok) throw new Error(`Failed to fetch bus details for ID: ${busId}`);
        const busData = await response.json();

        setBusDetails(busData);

        const studentsResponse = await fetch(
          `http://localhost:3000/api/buses/${busId}/students`
        );
        if (!studentsResponse.ok)
          throw new Error(`Failed to fetch students for bus ID: ${busId}`);
        const studentsData = await studentsResponse.json();

        const formattedStudents = studentsData.map((student: any) => ({
          id: student.id,
          name: student.name,
          residence: `${student.home_latitude}, ${student.home_longitude}`,
          parentContact: student.parent_contact || 'Not Available',
          pickupLocation: student.pickup_location || 'Not Available',
        }));
        setStudents(formattedStudents);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  const handleEditSave = async (updatedData: any) => {
    try {
      const response = await fetch(`http://localhost:3000/api/buses/${busId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update bus details');

      const updatedBus = await response.json();
      setBusDetails(updatedBus);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save changes.');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 border-r p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{busId}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Edit2 className="h-6 w-6" />
              <span className="sr-only">Edit</span>
            </button>
          </div>
          {busDetails && !isEditing ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">From:</p>
                <p className="font-medium">Sahyadri</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To:</p>
                <p className="font-medium">Ullal</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departure Time:</p>
                <p className="font-medium">9:30</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Driver:</p>
                <p className="font-medium">Ramesh Kumar</p>
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
          ) : null}
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

          {isEditing ? (
            <EditBusDetails
              busId={busId}
              initialData={busDetails}
              onCancel={() => setIsEditing(false)}
              onSave={handleEditSave}
            />
          ) : showAddStudentForm ? (
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
                      <th className="text-left py-4 px-4">ID</th>
                      <th className="text-left py-4 px-4">Name</th>
                      <th className="text-left py-4 px-4">USN</th>
                      <th className="text-left py-4 px-4">Home Latitude</th>
                      <th className="text-left py-4 px-4">Home Longitude</th>
                      <th className="text-left py-4 px-4">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="py-4 px-4">{student.id}</td>
                        <td className="py-4 px-4">{student.name}</td>
                        <td className="py-4 px-4">{student.usn}</td>
                        <td className="py-4 px-4">{student.home_latitude}</td>
                        <td className="py-4 px-4">{student.home_longitude}</td>
                        <td className="py-4 px-4">{student.home_address}</td>
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
