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
import ProtectedLayout from "./components/protectedLayout";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const onDelete = (id) => {
    dispatch(invoiceSlice.actions.deleteInvoice({ id }));
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="dark:bg-[#141625] duration-300 min-h-screen bg-[#f8f8fb]">
      {/* Header hanya muncul di halaman selain login */}
      {!isLoginPage && <Header />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Halaman Login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard (terproteksi) */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Center />} />
            <Route path="/invoices" element={<Center />} />
            <Route path="/payments" element={<Center />} />
            <Route path="/report" element={<Report />} />
            <Route
              path="/invoice"
              element={<InvoiceInfo onDelete={onDelete} />}
            />
            <Route path="/clients" element={<ClientPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
