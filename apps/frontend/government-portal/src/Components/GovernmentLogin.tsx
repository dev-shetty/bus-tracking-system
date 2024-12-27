import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GovernmentLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access_token); // Update token in localStorage
        window.dispatchEvent(new Event('storage')); // Notify the app of the change
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-96 p-6 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold mb-4">Government Login</h2>
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
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-600"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-gray-500 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default GovernmentLogin;
