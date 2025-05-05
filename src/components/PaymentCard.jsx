import React from 'react';
import { formatCurrency } from '../functions/formatCurrency';
import { FaFileInvoice, FaCalendarAlt, FaMoneyBillWave, FaLink, FaUser } from 'react-icons/fa';

function PaymentCard({ payment }) {
  return (
    <div className="bg-white dark:bg-[#1E2139] rounded-lg shadow-md p-6 flex flex-col space-y-6">
      {/* Client Name */}
      <div className="flex items-center space-x-2">
        <FaUser className="text-gray-500 dark:text-gray-400" />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Client Name</p>
          <p className="font-semibold text-gray-800 dark:text-white">{payment.clientName}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <FaFileInvoice className="text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Number</p>
            <p className="font-semibold text-gray-800 dark:text-white">{payment.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
            <p className="font-semibold text-gray-800 dark:text-white">{payment.paymentDate}</p>
          </div>
        </div>
      </div>

      {/* Amount Paid */}
      <div className="flex items-center space-x-2">
        <FaMoneyBillWave className="text-green-500" />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
          <p className="font-bold text-lg text-green-600 dark:text-green-400">
            {formatCurrency(payment.amountPaid, payment.currency)}
          </p>
        </div>
      </div>

      {/* Proof of Transfer */}
      <div className="flex items-center space-x-2">
        <FaLink className="text-blue-500" />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Proof of Transfer</p>
          <a
            href={payment.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            title="Click to view proof of transfer"
          >
            View Proof
          </a>
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;