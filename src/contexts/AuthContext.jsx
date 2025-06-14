import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Tentukan baseURL secara terpisah
const API_BASE_URL = "http://localhost:8081/users";

// Membuat Context untuk autentikasi
export const AuthContext = createContext({
  status: "loading",
  user: { username: "unauthorize", role: "staff" },
  login: async () => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ username: "unauthorize", role: "staff" });
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  // Fungsi login
  const login = async (username, password) => {
    console.log("masuk auth provider", username, " ", password);
    try {
      await axios.post(
        `${API_BASE_URL}/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      const userRes = await axios.get(`${API_BASE_URL}/profile`, {
        withCredentials: true,
      });
      setUser(userRes.data.data);
      console.log("user data", userRes.data.data);
      setStatus("authenticated");
    } catch (err) {
      errorHandler(err);
    }
  };

  // Fungsi logout
  const logout = () => {
    axios
      .delete(`${API_BASE_URL}/logout`, { withCredentials: true })
      .then(() => {
        setUser(null);
        setStatus("unauthenticated");
      })
      .catch((err) => errorHandler(err));
  };

  // Fungsi untuk menangani error
  const errorHandler = (err) => {
    console.error("An error occurred:", err);
    setStatus("unauthenticated");
  };

  // Mengecek status autentikasi pada saat komponen pertama kali dirender
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/profile`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.data);
        setStatus("authenticated");
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          // Coba untuk me-refresh token
          axios
            .get(`${API_BASE_URL}/refresh`, { withCredentials: true })
            .then(() => {
              axios
                .get(`${API_BASE_URL}/profile`, { withCredentials: true })
                .then((res) => {
                  setUser(res.data.data);
                  setStatus("authenticated");
                })
                .catch(() => logout());
            })
            .catch(() => logout());
          return;
        }
        logout();
      });
  }, []);

  useEffect(() => {
    // if user not logged in, set status to unauthenticated and redirect to /login
    if (status === "unauthenticated") {
      setUser({ username: "unauthorize", role: "staff" });
      setStatus("unauthenticated");
      navigate("/login");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
