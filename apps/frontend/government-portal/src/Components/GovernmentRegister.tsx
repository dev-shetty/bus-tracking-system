import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GovernmentRegister: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (response.ok) {
        alert('Registration successful! Redirecting to login...');
        navigate('/'); // Redirect to login
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-96 p-6 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          className="w-full mb-4 p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-600"
        >
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-gray-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default GovernmentRegister;
