import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CollegeFormData {
  institution: string;
  contact: string;
  location: string;
}

const AddCollege: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CollegeFormData>({
    institution: '',
    contact: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    navigate('/');
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
            <label htmlFor="location" className="text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
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