import React from 'react';

interface Driver {
  name: string;
  busId: string;
  age: number;
  joiningDate: string;
  mobile: string;
  residence: string;
}

const DriversList: React.FC = () => {
  const drivers: Driver[] = [
    {
      name: 'Ramesh Kumar',
      busId: 'KA19A0001',
      age: 34,
      joiningDate: '12/04/2019',
      mobile: '+919876543210',
      residence: 'Beeri, Ullal',
    },
    {
      name: 'Suresh Kumar',
      busId: 'KA19A0002',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Dinesh A',
      busId: 'KA19A0003',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Ganesh K P',
      busId: 'KA19A0004',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Laxmana',
      busId: 'KA19A0005',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Ramesh N',
      busId: 'KA19A0006',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Shivakumar',
      busId: 'KA19A0007',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Vinod K',
      busId: 'KA19A0008',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Satish Kumar',
      busId: 'KA19A0009',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Harish P',
      busId: 'KA19A0010',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Ramprasad V',
      busId: 'KA19A0011',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
    {
      name: 'Vijaykumar',
      busId: 'KA19A0012',
      age: 38,
      joiningDate: '15/06/2018',
      mobile: '+919876543211',
      residence: 'Mangalore',
    },
  ];

  return (
    <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3 mx-20">
      {drivers.map((driver) => (
        <div key={driver.busId} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-pink-200 self-start" />
            <div className="flex-1">
              <h3 className="font-semibold">{driver.name}</h3>
              <p className="text-sm text-gray-600">Bus: {driver.busId}</p>
              <p className="text-sm text-gray-600">Age: {driver.age}</p>
              <p className="text-sm text-gray-600">
                Joining Date: {driver.joiningDate}
              </p>
              <p className="text-sm text-gray-600">Mobile: {driver.mobile}</p>
              <p className="text-sm text-gray-600">
                Residence: {driver.residence}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriversList;
