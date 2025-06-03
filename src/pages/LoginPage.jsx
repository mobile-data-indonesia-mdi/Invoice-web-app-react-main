import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo_mdi.png";
import useAuth from "../hooks/useAuth.js";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, status } = useAuth();

  useEffect(() => {
    console.log("masuk effect login");
    console.log("status", status);
    if (status === "authenticated") {
      navigate("/invoices");
    }
  }, [status]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("mencoba masuk", username, " ", password);
      await login(username, password);
    } catch (error) {
      alert("username or password is incorrect!");
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
            <label className="block text-gray-700">Username</label>
            <input
              type="username"
              className="w-full px-3 py-2 border rounded text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 text-left">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded text-black"
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

export default LoginPage;
