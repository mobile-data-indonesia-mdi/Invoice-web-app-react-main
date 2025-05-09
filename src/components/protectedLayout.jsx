// ProtectedLayout.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingPage from "./LoadingPage";

const ProtectedLayout = () => {
  const { status } = useAuth();

  if (status === "loading") {
    return <LoadingPage />;
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Penting: ini yang akan render <Center />
};

export default ProtectedLayout;
