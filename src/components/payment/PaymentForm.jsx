import React, {useEffect, useState, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import moment from "moment/moment.js";

import paymentSlice, { createNewPayment, editPayment, fetchAllPayments } from '@/redux/paymentSlice.js';  // <-- import the action
import { paymentFormValidator } from '@/functions/validator/paymentFormValidator.js';
import { fetchAllInvoices } from '@/redux/invoiceSlice';

// Validation function
function validator(formData) {
  const msg = paymentFormValidator(formData);
  if (msg !== true) {
    alert(msg);
    return false;
  }
  return true;
}

export default function PaymentForm({ setOpenCreatePayment, setIsEditOpen, type }) {
  const dispatch = useDispatch();

  // Redux Selector
  const allInvoices = useSelector(state => state.invoices.allInvoices);
  console.log(allInvoices);
  const payment = type === "edit" ? useSelector(state => state.payments.paymentById) : {};
  const invoice = payment?.invoice || {};
  const client = invoice?.client || {};
  const errorPayment = useSelector(state => state.payments.error);


  // State Hooks
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState(type === "edit" ? payment?.invoice_number : '');
  const inputRef = useRef();
  const searchBoxRef = useRef();

  // Filter invoice berdasarkan input
  const filteredInvoices = allInvoices.filter(inv =>
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    (inv.client?.client_name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  // Payment state
  const [formData, setFormData] = useState({
    paymentDate:  type === "edit" ? moment(payment?.payment_date).format('YYYY-MM-DD') : '',
    amountPaid: type === "edit" ? payment?.amount_paid : '',
    invoiceNumber: type === "edit" ? payment?.invoice_number : '',
    proofFile: type === "edit" ? payment?.proof_of_transfer.split('\\').pop() : null,
    currency: type === "edit" ? client?.currency : 'USD',
    clientName: type === "edit" ? client?.client_name : ''
  });

  // Event Handler
  const handleSelectInvoice = (invoice) => {
    setFormData({
      ...formData,
      invoiceNumber: invoice.invoice_number,
      clientName: invoice.client?.client_name,
      currency: invoice.client?.currency,
    });
    setSelectedClient(invoice.client);
    setShowDropdown(false);
    setSearch(invoice.invoice_number);
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      proofFile: e.target.files[0]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    if (filteredInvoices.length === 0) {
        alert('Invoice number tidak ditemukan');
        return;
    }

    const payload = new FormData();
    payload.append('payment_date', formData.paymentDate);
    payload.append('amount_paid', formData.amountPaid);
    payload.append('invoice_number', formData.invoiceNumber);
    payload.append('client_id', '9fd5075c-e52b-4264-a3f0-551170e2281d'); // Contoh client_id
    payload.append('currency', formData.currency);
    payload.append('proof_of_transfer', formData.proofFile);

    // Dispatch ke Redux Thunk
    if (type === 'edit') {
      const result = await dispatch(editPayment({ id: payment.payment_id, paymentData: payload }));
      await dispatch(fetchAllPayments());
      if (!editPayment.rejected.match(result)) {
        setIsEditOpen(false);
      }
    } else {
      const result = await dispatch(createNewPayment(payload));
      await dispatch(fetchAllPayments());
      if (!createNewPayment.rejected.match(result)) {
        setOpenCreatePayment(false);
      }
    }
  };

  useEffect(() => {
    if (!allInvoices || allInvoices.length === 0) {
      dispatch(fetchAllInvoices());
    }
  }, [allInvoices?.length, dispatch]);

  useEffect(() => {
    if (!allInvoices[allInvoices.length-1].client) {
      dispatch(fetchAllInvoices());
    }
  }, [allInvoices?.length, dispatch()]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
    if (errorPayment && errorPayment.message) {
      alert(errorPayment.message);
      dispatch(paymentSlice.actions.resetError());
    }
  }, [errorPayment, dispatch]);



  return (
   <div
     onClick={e => {
       if (e.target === e.currentTarget) {
         if (type === 'edit') {
           dispatch(paymentSlice.actions.resetPaymentById());
           setIsEditOpen(false);
         } else {
           setOpenCreatePayment(false);
         }
       }
     }}
     className="fixed inset-0 bg-black bg-opacity-50 flex justify-end"
   >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-[#141625] w-full md:w-[600px] h-full p-8 overflow-auto"
      >
        <h1 className="text-3xl font-semibold mb-6 dark:text-white">
          {type === "edit" ? 'Edit' : 'Create'} Payment
        </h1>

        <div className="space-y-6">
          {/* Invoice Number */}
          <div style={{ position: "relative" }}>
            <label>Invoice Number</label>
            <input
              type="text"
              name='invoiceNumber'
              placeholder="Search by invoice number or client name"
              value={search}
              ref={inputRef}
              onFocus={() => setShowDropdown(true)}
              onChange={e => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
              autoComplete="off"
            />
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 10,
                  background: "white",
                  border: "1px solid #ccc",
                  width: "100%",
                  maxHeight: 200,
                  overflowY: "auto"
                }}
                onMouseDown={e => e.stopPropagation()}
              >
                {filteredInvoices.length === 0 && (
                  <div className="p-2 text-gray-400 dark:bg-[#1E2139] dark:text-white">No invoices found</div>
                )}
                {filteredInvoices.map(inv => (
                  <div
                    key={inv.invoice_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer dark:bg-[#1E2139] dark:text-white"
                    onClick={() => handleSelectInvoice(inv)}
                  >
                    {inv.invoice_number} - {inv.client?.client_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Payment Date</label>
            <input
              type="date"
              name='paymentDate'
              value={formData.paymentDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Currency</label>
            <select
              value={selectedClient?.currency || formData.currency}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-300 dark:bg-gray-500 dark:text-white"
              disabled
            >
              <option value="USD">USD (Dollar)</option>
              <option value="IDR">IDR (Rupiah)</option>
            </select>
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Amount Paid</label>
            <input
              type="number"
              name='amountPaid'
              value={formData.amountPaid}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
              placeholder="0.00"
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Client Name</label>
            <input
              type="text"
              name='clientName'
              value={selectedClient?.client_name || formData.clientName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-300 dark:bg-gray-500 dark:text-white"
              placeholder="Enter client name"
              disabled
            />
          </div>

          {/* Proof of Transfer */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Proof of Transfer</label>
            <input
              type="file"
              name='proofFile'
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
            />
            {formData.proofFile ? (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Selected file: {type === "edit" ? formData.proofFile : formData.proofFile.name}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No file selected
              </p>
            )
            }
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => {
              if (type === 'edit') {
                dispatch(paymentSlice.actions.resetPaymentById());
                setIsEditOpen(false);
              } else {
                setOpenCreatePayment(false);
              }
            }}
            className="px-6 py-2 bg-red-600 dark:bg-[#252945] rounded hover:opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={() => {if (validator(formData)) onSubmit()}}
            className="px-6 py-2 bg-[#7c5dfa] text-white rounded hover:opacity-80"
          >
            Save Payment
          </button>
        </div>
      </motion.div>
    </div>
  );
}
