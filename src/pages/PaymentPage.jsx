import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "@/components/ui/Sidebar.jsx";
import PaymentForm from "@/components/payment/PaymentForm.jsx";
import PaymentTable from "@/components/payment/PaymentTable";
import ContentHeader from "@/components/ui/content-header/ContentHeader.jsx";

import { fetchAllPayments } from "@/redux/paymentSlice.js";

export default function PaymentPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  // State Hooks
  const [openCreatePayment, setOpenCreatePayment] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("payments");
  const [isEditOpen, setIsEditOpen] = useState(false);

  // // Redux Selector
  const payments = useSelector(state => state.payments.filteredPayment);
  const loading = useSelector((state) => state.payments.loading);
  const error = useSelector((state) => state.payments.error);

  useEffect(() => {
    // Fetch all payments when the component mounts
    dispatch(fetchAllPayments());
  }, [dispatch]);

  return (
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
          <ContentHeader
            selectedMenu={selectedMenu}
            items={payments}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            onOpenCreateMenu={setOpenCreatePayment}
          />
            {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Loading payments...
                </p>
            ) : error ? (
                <p className="text-center text-red-500">Error fetching clients</p>
            ) : payments === null || payments.length  <= 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No payments found.
                </p>
            ) : (
                <PaymentTable setIsEditOpen={setIsEditOpen} from={selectedMenu}/>
            )}
        </motion.div>
      </div>
      {/* End Center */}

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {openCreatePayment && (
          <PaymentForm
            setOpenCreatePayment={setOpenCreatePayment}
          />
        )}
        {isEditOpen && (
          <PaymentForm setIsEditOpen={setIsEditOpen} type="edit" />
        )}
      </AnimatePresence>
    </div>
  );
}