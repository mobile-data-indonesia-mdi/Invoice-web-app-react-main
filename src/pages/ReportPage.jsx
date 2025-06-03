import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import Sidebar from "@/components/ui/Sidebar.jsx";
import ReportTable from "@/components/report/ReportTable.jsx";

import { formatCurrency } from "@/functions/formatCurrency.js";
import { fetchAllInvoices } from "@/redux/invoiceSlice.js";
import { fetchAllClients } from "@/redux/clientSlice.js";

function ReportPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [selectedMenu, setSelectedMenu] = useState("report");
  const [expandedClient, setExpandedClient] = useState(null);
  
  const allClients = useSelector((state) => state.clients.allClients || []);
  const allInvoices = useSelector((state) => state.invoices.allInvoices || []);

  // Gabungkan dan sederhanakan perhitungan piutang per klien dan total per mata uang
  const piutangData = {};
  const totalPerCurrency = {};

  allClients.forEach((client) => {
    const currency = client.currency || "IDR";
    const key = `${client.client_name}___${currency}`;
    const clientInvoices = allInvoices.filter(
      (inv) =>
        inv.client?.client_name === client.client_name &&
        ((inv.payment_status === "unpaid" || inv.payment_status === "partial") && inv.voided_at === null)
    );
    const total = clientInvoices.reduce((sum, inv) => {
      const amountDue = inv.total - inv.amount_paid;
      return sum + (amountDue > 0 ? amountDue : 0);
    }, 0);

    piutangData[key] = { client_name: client.client_name, currency, total };
    totalPerCurrency[currency] = (totalPerCurrency[currency] || 0) + total;
  });

  const toggleClient = (key) => {
    setExpandedClient((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    // Fetch all invoices when the component mounts
    dispatch(fetchAllInvoices());
    dispatch(fetchAllClients());
  }, [dispatch]);

  return (
    <div className="flex bg-[#f8f8fb] dark:bg-[#141625] min-h-screen">
      {/* Sidebar */}
      <Sidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />

      {/* Main Content */}
      <div className="w-full px-2 py-10 md:py-16 lg:py-28 scrollbar-hide duration-300 ml-0 md:ml-48">
        <motion.div
            key={location.pathname}
            initial={{ x: "0" }}
            animate={{ x: 0 }}
            exit={{ x: "-150%" }}
            transition={{ duration: 0.5 }}
            className="max-w-full md:max-w-3xl lg:max-w-6xl mx-auto"
        >
          {/* Report Title */}
          <h1 className="lg:text-4xl md:text-2xl text-xl dark:text-white tracking-wide font-semibold">Laporan Piutang</h1>

          {/* Informasi Total Piutang */}
          <div className="mt-6 bg-white dark:bg-[#1E2139] rounded-lg p-4 shadow-md">
            <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-4 mb-4">
              {/* Total Piutang per Klien */}
            <h2 className="text-lg font-semibold dark:text-white mb-3">
              Total Piutang per Klien
            </h2>
            <ul className="space-y-2">
              {allClients.map((client) => {
                // Cari key piutangData untuk client ini (dengan currency)
                const currency = client.currency || "IDR";
                const key = `${client.client_name}___${currency}`;
                const data = piutangData[key];

                return (
                  <li
                    key={key}
                    className="text-lg text-gray-700 dark:text-gray-200 flex justify-between"
                  >
                    <p>{client.client_name}</p>
                    <p>{formatCurrency(data?.total || 0, currency)}</p>
                  </li>
                );
              })}
            </ul>
            </div>

            {/*Total Keseluruhan Piutang*/}
            <h2 className="text-lg font-semibold dark:text-white mt-6 mb-3">
              Total Piutang
            </h2>
            <ul>
              {Object.entries(totalPerCurrency).map(([curr, total]) => (
                <li key={curr} className="flex gap-4 text-lg">
                  <span>Total {curr}</span>
                  <span>=</span>
                  <span>{formatCurrency(total, curr)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/*Tabel Piutang*/}
          <div className="mt-8">
            <h2 className="lg:text-2xl md:text-xl text-md dark:text-white font-semibold">Detail Piutang Per Klien</h2>
            <ReportTable from={selectedMenu}/>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ReportPage;
