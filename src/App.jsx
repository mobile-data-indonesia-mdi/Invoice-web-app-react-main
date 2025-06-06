import React from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import LoginPage from "@/pages/LoginPage.jsx";
import ClientPage from "@/pages/ClientPage.jsx";
import InvoicePage from "@/pages/InvoicePage";
import InvoiceInfo from "@/pages/InvoiceInfo.jsx";
import PaymentPage from "@/pages/PaymentPage.jsx";
import ReportPage from "@/pages/ReportPage.jsx";

import Header from "@/components/ui/Header.jsx";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  console.log("API_BASE_URL_APP_JS", import.meta.env.VITE_API_URL);
  return (
    <div className="dark:bg-[#141625] duration-300 min-h-screen bg-[#f8f8fb]">
      {/* Header hanya muncul di halaman selain login */}
      {!isLoginPage && <Header />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/invoices" replace />} />

          {/* Halaman Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Halaman Invoices */}
          <Route path="/invoices" element={<InvoicePage />} />

          {/* Invoice Detail */}
          <Route path="/invoices/:invoiceId" element={<InvoiceInfo />} />

          {/* Halaman Payments */}
          <Route path="/payments" element={<PaymentPage />} />

          {/* Halaman Clients */}
          <Route path="/clients" element={<ClientPage />} />

          {/* Halaman Report */}
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
