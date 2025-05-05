import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Center from './components/Center';
import Header from './components/Header';
import InvoiceInfo from './components/InvoiceInfo';
import Login from './components/login';
import Report from './components/Report';
import invoiceSlice from './redux/invoiceSlice';

// Private route component
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn
    ? children
    : <Navigate to="/login" replace />;
};

function InvoiceCard({ invoice, onDelete, from }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/invoice?id=${invoice.id}`, { state: { from } });
  };

  const handleDownload = () => {
    navigate(`/invoice?id=${invoice.id}&download=true`, { state: { from } });
  };

  return (
    <>
      <td className="py-4 px-6 font-semibold text-[#7e88c3] dark:text-white">
        <button onClick={handleView} className="hover:underline">
          #{invoice.id}
        </button>
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
        {invoice.paymentDue}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
        {invoice.clientName}
      </td>
      <td className="py-4 px-6 font-medium text-black dark:text-white text-right">
        {formatCurrency(
          invoice.items.reduce(
            (sum, item) => sum + (item.quantity || 0) * (item.usage || 1) * (item.price || 0),
            0
          ),
          invoice.currency || 'USD'
        )}
      </td>
      <td className="py-4 px-6 text-center">
        <PaidStatus type={invoice.status} />
      </td>
      <td className="py-4 px-6 text-center space-x-2">
        {/* View Button */}
        <button
          onClick={handleView}
          className="text-blue-500 hover:text-blue-700"
          title="View"
        >
          <FiEye />
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="text-green-500 hover:text-green-700"
          title="Download PDF"
        >
          <FiDownload />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(invoice.id)}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          <FiTrash2 />
        </button>
      </td>
    </>
  );
}

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const onDelete = (id) => {
    dispatch(invoiceSlice.actions.deleteInvoice({ id }));
  };

  const isLoginPage = location.pathname === '/login';
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  // Jika belum login dan bukan di halaman login, langsung redirect
  if (!isLoggedIn && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

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
              <PrivateRoute>
                <Center />
              </PrivateRoute>
            }
          />

          {/* Halaman Invoices */}
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Center />
              </PrivateRoute>
            }
          />

          {/* Halaman Payments */}
          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <Center />
              </PrivateRoute>
            }
          />

          {/* Halaman Report */}
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            }
          />

          {/* Invoice Detail (terproteksi) */}
          <Route
            path="/invoice"
            element={
              <PrivateRoute>
                <InvoiceInfo onDelete={onDelete} />
              </PrivateRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
