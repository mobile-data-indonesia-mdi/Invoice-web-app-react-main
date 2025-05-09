import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/Sidebar.jsx";
import ContentHeader from "../components/ContentHeader.jsx";
import CreateInvoice from "../components/invoice/CreateInvoice.jsx";
import InvoiceCard from "../components/invoice/InvoiceCard.jsx";

import invoiceSlice, { fetchInvoices } from "../redux/invoiceSlice.js";
import useAuth from "../hooks/useAuth.js";

export default function InvoicePage() {
  const location = useLocation();
  const controls = useAnimation();
  const dispatch = useDispatch();
  const auth = useAuth();

  // State Hooks
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  // Redux Selectors
  const invoices = useSelector((state) => state.invoices.filteredInvoice);

  useEffect(() => {
    // Ambil semua invoice saat komponen dimuat
    dispatch(fetchInvoices());
  }, []);

  useEffect(() => {
    // Filter invoices berdasarkan status
    dispatch(invoiceSlice.actions.filterInvoice({ status: filterValue }));
  }, [filterValue, dispatch]);

  // Animasi kontrol
  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    });
  }, [controls]);

  const onDelete = (id) => {
    dispatch(invoiceSlice.actions.deleteInvoice({ id }));
  };

  return(
    <div className="flex">
      <Sidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />

      {/* Center */}
      <div className="dark:bg-[#141625] scrollbar-hide duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 lg:py-[100px] w-full">
        <motion.div
          key={location.pathname}
          initial={{ x: "0" }}
          animate={{ x: 0 }}
          exit={{ x: "-150%" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl md:max-w-6xl mx-auto my-auto"
        >
          {/* Content Header */}
          <ContentHeader
            selectedMenu={selectedMenu}
            items={invoices}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            onOpenCreateMenu={setOpenCreateInvoice}
          />

          {/* Page Content */}
          <div className="mt-10 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="table-auto w-full bg-white dark:bg-[#1E2139] rounded-lg">
                <thead className="bg-gray-100 dark:bg-[#252945] text-sm text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="py-4 px-4">Invoice ID</th>
                  <th className="py-4 px-4">Due Date</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4 text-right">Total</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Action</th>
                  {auth.user.role === 'finance' && (<th className="py-4 px-4 text-center">Void</th>)}
                </tr>
                </thead>
                <tbody>
                <AnimatePresence>
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">
                        Tidak ada invoice saat ini.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice, index) => (
                      <motion.tr
                        key={invoice.invoice_id}
                        initial={{opacity: 0, y: -10}}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {delay: index * 0.1},
                        }}
                        exit={{opacity: 0, y: 10}}
                        transition={{duration: 0.3}}
                        className="hover:bg-gray-50 dark:hover:bg-[#252945] transition-all"
                      >
                        <InvoiceCard
                          invoice={invoice}
                          onDelete={onDelete}
                          from={selectedMenu}
                        />
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
          {/* End Page Content */}

        </motion.div>
      </div>
      {/* End Center */}

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {openCreateInvoice && (
          <CreateInvoice
            openCreateInvoice={openCreateInvoice}
            setOpenCreateInvoice={setOpenCreateInvoice}
          />
        )}
      </AnimatePresence>
    </div>
  );
}