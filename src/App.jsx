import React from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Center from "./components/Center";
import Header from "./components/Header";
import InvoiceInfo from "./components/InvoiceInfo";
import Login from "./components/login";
import Report from "./components/Report";
import invoiceSlice from "./redux/invoiceSlice";
import ClientPage from "./components/ClientPage";
import InvoicePage from "./pages/InvoicePage";

// Private route component
// const PrivateRoute = ({ children }) => {
//   const isLoggedIn = localStorage.getItem("loggedIn") === "true";
//   return isLoggedIn ? children : <Navigate to="/login" replace />;
// };

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const onDelete = (id) => {
    dispatch(invoiceSlice.actions.deleteInvoice({ id }));
  };

  const isLoginPage = location.pathname === "/login";
  // const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  // Jika belum login dan bukan di halaman login, langsung redirect
  // if (!isLoggedIn && !isLoginPage) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <div className="dark:bg-[#141625] duration-300 min-h-screen bg-[#f8f8fb]">
      {/* Header hanya muncul di halaman selain login */}
      {!isLoginPage && <Header />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Halaman Login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard (terproteksi) */}
          <Route
            path="/"
            element={
              // <PrivateRoute
              <Center />
              // </PrivateRoute>
            }
          />

          {/* Halaman Invoices */}
          <Route
            path="/invoices"
            element={
              // <PrivateRoute>
              <InvoicePage />
              // </PrivateRoute>
            }
          />

          {/* Halaman Payments */}
          <Route
            path="/payments"
            element={
              // <PrivateRoute>
              <Center />
              // </PrivateRoute>
            }
          />

          {/* Halaman Report */}
          <Route
            path="/report"
            element={
              // <PrivateRoute>
              <Report />
              // </PrivateRoute>
            }
          />

          {/* Invoice Detail (terproteksi) */}
          <Route
            path="/invoice"
            element={
              // <PrivateRoute>
              <InvoiceInfo onDelete={onDelete} />
              // </PrivateRoute>
            }
          />
          <Route
            path="/clients"
            element={
              // <PrivateRoute>
              <ClientPage />
              // </PrivateRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
