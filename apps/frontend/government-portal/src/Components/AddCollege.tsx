import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CollegeFormData {
  institution: string;
  contact: string;
  latitude: number | '';
  longitude: number | '';
}

const AddCollege: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CollegeFormData>({
    institution: '',
    contact: '',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'latitude' || name === 'longitude'
          ? parseFloat(value) || ''
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.latitude === '' || formData.longitude === '') {
      alert('Please provide valid latitude and longitude values.');
      return;
    }

    const payload = {
      name: formData.institution,
      contact: formData.contact,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3000/api/institutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('College added successfully');
        navigate('/portal');
      } else {
        console.error('Failed to add college:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding college:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Add a new college</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-[120px,1fr] items-center gap-4">
            <label htmlFor="institution" className="text-gray-700">
              Institution
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Enter the name of the Institution"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4">
            <label htmlFor="contact" className="text-gray-700">
              Contact
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter a phone number"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4">
            <label htmlFor="latitude" className="text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Enter latitude"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4">
            <label htmlFor="longitude" className="text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Enter longitude"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-navy-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollege;
