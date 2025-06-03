import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "@/components/ui/Sidebar.jsx";
import ContentHeader from "@/components/ui/content-header/ContentHeader.jsx";
import InvoiceForm from "@/components/invoice/InvoiceForm.jsx";

import { fetchAllInvoices } from "@/redux/invoiceSlice.js";
import useAuth from "@/hooks/useAuth.js";
import InvoiceTable from "@/components/invoice/InvoiceTable.jsx";

export default function InvoicePage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useAuth();

  // State Hooks
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("invoices");

  // Redux Selectors
  const invoices = useSelector((state) => state.invoices.filteredInvoice);
  const loading = useSelector((state) => state.invoices.loading);
  const error = useSelector((state) => state.invoices.error);

  useEffect(() => {
    // Ambil semua invoice saat komponen dimuat
    dispatch(fetchAllInvoices());
  }, [dispatch]);

  return(
    <div className="flex bg-[#f8f8fb] dark:bg-[#141625] min-h-screen">
      <Sidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />

      {/* Center */}
      <div className="w-full px-2 py-10 md:py-16 lg:py-28 scrollbar-hide duration-300 ml-0 md:ml-48">
        <motion.div
          key={location.pathname}
          initial={{ x: "0" }}
          animate={{ x: 0 }}
          exit={{ x: "-150%" }}
          transition={{ duration: 0.5 }}
          className="max-w-full md:max-w-3xl lg:max-w-6xl mx-auto"
        >
          {/* Content Header */}
          <ContentHeader
            selectedMenu={selectedMenu}
            items={invoices}
            onOpenCreateMenu={setOpenCreateInvoice}
          />
            {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    Loading invoices...
                </p>
            ) : error ? (
                <p className="text-center text-red-500">Error fetching clients</p>
            ) : invoices === null || invoices.length  <= 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No invoices found.
                </p>
            ) : (
                <InvoiceTable from={selectedMenu} />
            )}

        </motion.div>
      </div>
      {/* End Center */}

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {openCreateInvoice && (
          <InvoiceForm
            openCreateInvoice={openCreateInvoice}
            setOpenCreateInvoice={setOpenCreateInvoice}
          />
        )}
      </AnimatePresence>
    </div>
  );
}