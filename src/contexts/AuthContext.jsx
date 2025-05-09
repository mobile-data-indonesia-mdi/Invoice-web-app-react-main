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

      const res = await axios.get(`${API_BASE_URL}/profile`, {
        withCredentials: true,
      });
      console.log(res.data);

      setUser(res.data.data);
      setStatus("authenticated");
      navigate("/invoices");
    } catch (err) {
      console.log("test");
      errorHandler(err);
    }
  };

  // Fungsi logout
  const logout = () => {
    axios
      .delete(`${API_BASE_URL}/logout`, { withCredentials: true })
      .then(() => {
        setUser({ username: "unauthorize", role: "staff" });
        setStatus("unauthenticated");
      })
      .catch((err) => errorHandler(err));
  };

  // Fungsi untuk menangani error
  const errorHandler = (err) => {
    console.error(err.response.data.data);
    alert(res.data.message);
    setStatus("unauthenticated");
  };

  // Mengecek status autentikasi pada saat komponen pertama kali dirender
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          withCredentials: true,
        });

        setUser(res.data.data);

        setStatus("authenticated");
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            await axios.post(`${API_BASE_URL}/refresh-token`, {
              withCredentials: true,
            });

            const resProf = await axios.get(`${API_BASE_URL}/profile`, {
              withCredentials: true,
            });
            setUser(resProf.data.data);
            setStatus("authenticated");
          } catch {
            logout();
            navigate("/login");
          }
        } else {
          logout();
          navigate("/login");
        }
      }
    };

    fetchProfile();
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
