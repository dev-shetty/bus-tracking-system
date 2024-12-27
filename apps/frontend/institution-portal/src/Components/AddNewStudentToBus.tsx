import React, { useState } from 'react';

interface AddNewStudentToBusProps {
  busId: string;
  accessToken: string; // Add accessToken prop for passing the token
}

const AddNewStudentToBus: React.FC<AddNewStudentToBusProps> = ({ busId, accessToken }) => {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    year: '',
    homeLatitude: '',
    homeLongitude: '',
    homeAddress: '',
    parentName: '',
    parentPhone: '',
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
      usn: formData.usn,
      year: parseInt(formData.year, 10),
      home_latitude: parseFloat(formData.homeLatitude),
      home_longitude: parseFloat(formData.homeLongitude),
      home_address: formData.homeAddress,
      parents: [
        {
          name: formData.parentName,
          phone: formData.parentPhone,
        },
      ],
    };

    try {
      const response = await fetch(`http://localhost:3000/api/buses/${busId}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Add the access token in headers
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add the student. Please try again.');
      }

      setSuccessMessage('Student added successfully!');
      setFormData({
        name: '',
        usn: '',
        year: '',
        homeLatitude: '',
        homeLongitude: '',
        homeAddress: '',
        parentName: '',
        parentPhone: '',
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
          <label htmlFor="usn" className="block text-sm font-medium">
            USN
          </label>
          <input
            type="text"
            id="usn"
            name="usn"
            value={formData.usn}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
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
          <label htmlFor="homeAddress" className="block text-sm font-medium">
            Home Address
          </label>
          <input
            type="text"
            id="homeAddress"
            name="homeAddress"
            value={formData.homeAddress}
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
