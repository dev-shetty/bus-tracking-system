// EditBusDetails.tsx
import React, { useState } from 'react';

interface EditBusDetailsProps {
  busId: string;
  initialData: {
    busNo: string;
    institutionId: string;
    driverId: string;
    deviceId: string;
  };
  onCancel: () => void;
  onSave: (updatedData: any) => void;
}

const EditBusDetails: React.FC<EditBusDetailsProps> = ({ busId, initialData, onCancel, onSave }) => {
  const [busNo, setBusNo] = useState(initialData.busNo);
  const [institutionId, setInstitutionId] = useState(initialData.institutionId);
  const [driverId, setDriverId] = useState(initialData.driverId);
  const [deviceId, setDeviceId] = useState(initialData.deviceId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/buses/${busId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bus_no: busNo,
          institution_id: institutionId,
          driver_id: driverId,
          device_id: deviceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update bus details');
      }

      const updatedData = await response.json();
      onSave(updatedData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-6">Edit Bus Details</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="busNo" className="block text-sm font-medium">Bus Number</label>
          <input
            id="busNo"
            type="text"
            value={busNo}
            onChange={(e) => setBusNo(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="institutionId" className="block text-sm font-medium">Institution ID</label>
          <input
            id="institutionId"
            type="text"
            value={institutionId}
            onChange={(e) => setInstitutionId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="driverId" className="block text-sm font-medium">Driver ID</label>
          <input
            id="driverId"
            type="text"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="deviceId" className="block text-sm font-medium">Device ID</label>
          <input
            id="deviceId"
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded-md"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBusDetails;
