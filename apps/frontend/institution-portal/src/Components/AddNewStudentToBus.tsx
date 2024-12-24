import React, { useState } from 'react';

interface AddNewStudentToBusProps {
  busId: string;
}

const AddNewStudentToBus: React.FC<AddNewStudentToBusProps> = ({ busId }) => {
  const [formData, setFormData] = useState({
    name: '',
    homeLatitude: '',
    homeLongitude: '',
    institutionId: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const studentData = {
      name: formData.name,
      home_latitude: parseFloat(formData.homeLatitude),
      home_longitude: parseFloat(formData.homeLongitude),
      bus_id: parseInt(busId, 10),
      institution_id: parseInt(formData.institutionId, 10),
      parents: [
        {
          name: formData.parentName,
          phone: formData.parentPhone,
          email: formData.parentEmail,
        },
      ],
    };

    try {
      const response = await fetch(`http://localhost:3000/api/buses/${busId}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add the student. Please try again.');
      }

      setSuccessMessage('Student added successfully!');
      setFormData({
        name: '',
        homeLatitude: '',
        homeLongitude: '',
        institutionId: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Student to Bus</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Student Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="homeLatitude" className="block text-sm font-medium">
            Home Latitude
          </label>
          <input
            type="number"
            step="any"
            id="homeLatitude"
            name="homeLatitude"
            value={formData.homeLatitude}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="homeLongitude" className="block text-sm font-medium">
            Home Longitude
          </label>
          <input
            type="number"
            step="any"
            id="homeLongitude"
            name="homeLongitude"
            value={formData.homeLongitude}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="institutionId" className="block text-sm font-medium">
            Institution ID
          </label>
          <input
            type="number"
            id="institutionId"
            name="institutionId"
            value={formData.institutionId}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="parentName" className="block text-sm font-medium">
            Parent Name
          </label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="parentPhone" className="block text-sm font-medium">
            Parent Phone
          </label>
          <input
            type="tel"
            id="parentPhone"
            name="parentPhone"
            value={formData.parentPhone}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="parentEmail" className="block text-sm font-medium">
            Parent Email
          </label>
          <input
            type="email"
            id="parentEmail"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className=" bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
        >
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default AddNewStudentToBus;
