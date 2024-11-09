import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Student {
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

  const students: Student[] = [
    {
      name: 'Deveesh',
      residence: 'Kannur',
      parentContact: '+919876543210',
      pickupLocation: 'Kannur',
    },
    {
      name: 'Deelan',
      residence: 'Padil',
      parentContact: '+919876543210',
      pickupLocation: 'Padil',
    },
    {
      name: 'Shrutha',
      residence: 'Padil',
      parentContact: '+919876543210',
      pickupLocation: 'Padil',
    },
    {
      name: 'Akkil',
      residence: 'Padil',
      parentContact: '+919876543210',
      pickupLocation: 'Padil',
    },
    {
      name: 'Adithya',
      residence: 'Naguri',
      parentContact: '+919876543210',
      pickupLocation: 'Naguri',
    },
    {
      name: 'Rohan',
      residence: 'Pumpwell',
      parentContact: '+919876543210',
      pickupLocation: 'Pumpwell',
    },
    {
      name: 'Babith',
      residence: 'Pumpwell',
      parentContact: '+919876543210',
      pickupLocation: 'Pumpwell',
    },
    {
      name: 'Parth',
      residence: 'Pumpwell',
      parentContact: '+919876543210',
      pickupLocation: 'Pumpwell',
    },
    {
      name: 'Prajwal',
      residence: 'Bendoorwell',
      parentContact: '+919876543210',
      pickupLocation: 'Kankanady',
    },
    {
      name: 'Sahan',
      residence: 'SS Nagar',
      parentContact: '+919876543210',
      pickupLocation: 'Jyothi Circle',
    },
    {
      name: 'Sujan',
      residence: 'SS Nagar',
      parentContact: '+919876543210',
      pickupLocation: 'Jyothi Circle',
    },
    {
      name: 'Srujan',
      residence: 'Police lane',
      parentContact: '+919876543210',
      pickupLocation: 'Hampankatta',
    },
    {
      name: 'Aadil',
      residence: 'Police lane',
      parentContact: '+919876543210',
      pickupLocation: 'Hampankatta',
    },
    {
      name: 'Keerthan',
      residence: 'Pandeshwar',
      parentContact: '+919876543210',
      pickupLocation: 'Pandeshwar',
    },
    {
      name: 'Kripesh',
      residence: 'Pandeshwar',
      parentContact: '+919876543210',
      pickupLocation: 'Pandeshwar',
    },
    {
      name: 'Ninad',
      residence: 'Pandeshwar',
      parentContact: '+919876543210',
      pickupLocation: 'Pandeshwar',
    },
    {
      name: 'Kaushik',
      residence: 'Mangaladevi',
      parentContact: '+919876543210',
      pickupLocation: 'Mangaladevi',
    },
    {
      name: 'Rezaan',
      residence: 'Mangaladevi',
      parentContact: '+919876543210',
      pickupLocation: 'Mangaladevi',
    },
    {
      name: 'Adithya Nayak',
      residence: 'Morgans gate',
      parentContact: '+919876543210',
      pickupLocation: 'Morgans gate',
    },
  ];

  const busDetails = {
    from: 'Sahyadri',
    to: 'Ullal',
    departureTime: '8:00 AM',
    speed: '40 km/h',
    numberOfStudents: '25',
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
              {showMap ? 'View Students list' : 'View Bus Location'}
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

          {showMap ? (
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">Map will be implemented here</p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto mb-4">
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
                  {students.map((student, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-4">{student.name}</td>
                      <td className="py-4 px-4">{student.residence}</td>
                      <td className="py-4 px-4">{student.parentContact}</td>
                      <td className="py-4 px-4">{student.pickupLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetail;
