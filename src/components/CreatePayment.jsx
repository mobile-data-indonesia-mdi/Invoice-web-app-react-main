import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addPayment } from '../redux/paymentSlice';  // <-- import the action
import invoiceSlice from '../redux/invoiceSlice';

export default function CreatePayment({ openCreatePayment, setOpenCreatePayment }) {
  const dispatch = useDispatch();

  const [paymentDate, setPaymentDate] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [clientName, setClientName] = useState('');

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const onSubmit = () => {
    if (!paymentDate || !amountPaid || !invoiceNumber || !proofFile) {
      alert('Semua field wajib diisi');
      return;
    }

    const payload = {
      id: uuidv4(),
      paymentDate,
      amountPaid: parseFloat(amountPaid),
      invoiceNumber,
      clientName, // Tambahkan client name ke payload
      currency, // Tambahkan kurs ke payload
      proofUrl: URL.createObjectURL(proofFile),
    };

    dispatch(addPayment(payload));  // <-- dispatch the named action
    // optional: mark invoice as paid
    dispatch(invoiceSlice.actions.updateInvoiceStatus({ id: invoiceNumber, status: 'paid' }));

    setOpenCreatePayment(false);
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && setOpenCreatePayment(false)}
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
          Create Payment
        </h1>

        <div className="space-y-6">
          {/* Invoice Number */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
              
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Payment Date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
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
              value={amountPaid}
              onChange={e => setAmountPaid(e.target.value)}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
              placeholder="0.00"
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
              placeholder="Enter client name"
            />
          </div>

          {/* Proof of Transfer */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">Proof of Transfer</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded dark:bg-[#1E2139] dark:text-white"
            />
            {proofFile && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Selected file: {proofFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => setOpenCreatePayment(false)}
            className="px-6 py-2 bg-red-600 dark:bg-[#252945] rounded hover:opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-[#7c5dfa] text-white rounded hover:opacity-80"
          >
            Save Payment
          </button>
        </div>
      </motion.div>
    </div>
  );
}
