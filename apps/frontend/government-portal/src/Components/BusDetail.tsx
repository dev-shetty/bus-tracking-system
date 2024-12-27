import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Student {
  id: number;
  name: string;
  usn: string;
  home_latitude: string;
  home_longitude: string;
  home_address: string;
}

interface BusDetailProps {
  busId: string;
  onClose: () => void;
}

const BusDetail: React.FC<BusDetailProps> = ({ busId, onClose }) => {
  const [showMap, setShowMap] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [busDetails, setBusDetails] = useState<any>(null);
  const [busRoute, setBusRoute] = useState<any>(null);
  const [busLocation, setBusLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken') || '';

  const getAuthHeaders = () => {
    if (!token) {
      throw new Error('Access token is missing. Please log in.');
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch bus specific details
        const busResponse = await fetch(
          `http://localhost:3000/api/buses/bus/${busId}`,
          {
            headers: getAuthHeaders(),
          }
        );
        if (!busResponse.ok)
          throw new Error(`Failed to fetch bus details for ID: ${busId}`);
        const busData = await busResponse.json();
        setBusDetails(busData);

        // Fetch bus route details
        const routeResponse = await fetch(
          `http://localhost:3000/api/buses/route/${busId}`,
          {
            headers: getAuthHeaders(),
          }
        );
        if (!routeResponse.ok)
          throw new Error(`Failed to fetch route details for bus ID: ${busId}`);
        const routeData = await routeResponse.json();
        setBusRoute(routeData);

        // Fetch current bus location
        const locationResponse = await fetch(
          `http://localhost:3000/api/location/${busId}`,
          {
            headers: getAuthHeaders(),
          }
        );
        if (!locationResponse.ok)
          throw new Error(
            `Failed to fetch location details for bus ID: ${busId}`
          );
        const locationData = await locationResponse.json();
        setBusLocation(locationData);

        // Fetch students assigned to the bus
        const studentsResponse = await fetch(
          `http://localhost:3000/api/buses/students/${busId}`,
          {
            headers: getAuthHeaders(),
          }
        );
        if (!studentsResponse.ok)
          throw new Error(`Failed to fetch students for bus ID: ${busId}`);
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 border-r p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{busDetails?.id}</h2>
          </div>
          {busDetails ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Institution ID:</p>
                <p className="font-medium">{busDetails.institution_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Driver ID:</p>
                <p className="font-medium">{busDetails.driver_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Location:</p>
                <p className="font-medium">{busLocation?.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle Speed:</p>
                <p className="font-medium">{busLocation?.speed} km/h</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Latitude:</p>
                <p className="font-medium">{busLocation?.latitude}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Longitude:</p>
                <p className="font-medium">{busLocation?.longitude}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ignition:</p>
                <p className="font-medium">{busLocation?.ignition ? "ON" : "OFF"}</p>
              </div>
              <button
                onClick={() => setShowMap(!showMap)}
                className="w-full bg-black text-white rounded-md py-2 px-4 text-sm"
              >
                {showMap ? 'View Students List' : 'View Bus Location'}
              </button>
            </div>
          ) : null}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-14 p-2 rounded-full hover:bg-gray-100 z-50"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button>

          {showMap ? (
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative z-10">
              {busLocation?.latitude && busLocation?.longitude ? (
                <MapContainer
                  center={[busLocation.latitude, busLocation.longitude]} // Center map at the bus location
                  zoom={13} // Adjust zoom level
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[busLocation.latitude, busLocation.longitude]}
                  >
                    <Popup>Bus Current Location</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p className="text-gray-500">Bus location not available</p>
              )}
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
