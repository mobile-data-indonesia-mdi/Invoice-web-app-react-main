import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo_mdi.png";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'admin@example.com' && password === 'admin') {
      const user = {
        email,
        role: "admin",
      };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("loggedIn", "true");

      setTimeout(() => {
        navigate('/invoices'); // ✅ Redirect langsung ke /invoices
      }, 10);
    } else if (email === 'user@example.com' && password === 'user') {
      const user = {
        email,
        role: "user",
      };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("loggedIn", "true");

      setTimeout(() => {
        navigate('/invoices'); // ✅ Redirect langsung ke /invoices
      }, 10);
    } else {
      alert('Email atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <img src={Logo} alt="App Logo" className="mx-auto w-24 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6">Login to your account</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4 text-left">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 text-left">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
