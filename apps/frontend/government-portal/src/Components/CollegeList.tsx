import React from 'react';
import { useNavigate } from 'react-router-dom';

interface College {
  id: string;
  code: string;
  name: string;
  address: string;
}

const colleges: College[] = [
  {
    id: '1',
    code: 'SF',
    name: 'Sahyadri',
    address: 'Sahyadri College Of Engineering and Management, Adyar, Mangaluru, 575005'
  },
  {
    id: '2',
    code: 'BS',
    name: 'Blue Sky',
    address: 'Blue Sky English Medium Higher Primary School, Mangaluru, 575005'
  },
  {
    id: '3',
    code: 'MA',
    name: 'Maple',
    address: 'Maple College Of Engineering, Pumpwell, Mangaluru, 575005'
  },
  {
    id: '4',
    code: 'YC',
    name: 'Yenepoya',
    address: 'Yenepoya College Of Engineering, Pumpwell, Mangaluru, 575005'
  },
  {
    id: '5',
    code: 'GV',
    name: 'Green Valley',
    address: 'Green Valley Higher Primary School, Ashoknagar, Mangaluru, 575005'
  },
  {
    id: '6',
    code: 'AL',
    name: 'Aloysious',
    address: 'St. Aloysious Pre University College, Kodialbail, Mangaluru, 575005'
  },
  {
    id: '7',
    code: 'SR',
    name: 'Srinivas',
    address: 'Srinivas Institute of Technology and Management, Mangaluru, 575005'
  },
  {
    id: '8',
    code: 'BA',
    name: 'Barakah',
    address: 'Barakah Pre University College, Adyar katte, Mangaluru, 575005'
  },
  {
    id: '9',
    code: 'SU',
    name: 'Sunshine',
    address: 'Sunshine English Medium Higher Primary School, Mangaluru, 575005'
  },
  {
    id: '10',
    code: 'HA',
    name: 'Harmony',
    address: 'Harmony College Of Engineering, Hampankatta, Mangaluru, 575005'
  }
];

const CollegeCard: React.FC<College & { onClick: () => void }> = ({ code, name, address, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-b from-pink-500 to-purple-600 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
    >
      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-purple-600 font-semibold mb-4">
        {code}
      </div>
      <h2 className="text-white text-xl font-semibold mb-2">{name}</h2>
      <p className="text-white/90 text-sm">{address}</p>
    </div>
  );
};

const CollegeList: React.FC = () => {
    const navigate = useNavigate();

    const handleCollegeClick = (collegeId: string) => {
      navigate(`/institution/${collegeId}`);
    };

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