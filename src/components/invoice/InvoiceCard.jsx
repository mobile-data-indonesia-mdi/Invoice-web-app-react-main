import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';   // Import useDispatch

import PaidStatus from '../PaidStatus.jsx';
import VoidModal from '../modal/VoidModal.jsx';
import DeleteModal from '../modal/DeleteModal.jsx'; // Import DeleteModal

import { toggleVoidExistingInvoice } from '../../redux/invoiceSlice.js';  // Import invoiceSlice
import { formatCurrency } from '../../functions/formatCurrency.js';
import { FiEye, FiDownload, FiTrash2 } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth.js';

function InvoiceCard({ invoice, onDelete, from }) {
  const dispatch = useDispatch();    // Inisialisasi dispatch
  const navigate = useNavigate();
  const auth = useAuth();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidStatus, setVoidStatus] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State untuk modal delete
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(null); // State untuk menyimpan invoice ID yang akan dihapus

  // Fungsi untuk menavigasi ke halaman invoice
  const handleView = () => {
    navigate(`/invoice?id=${invoice.invoice_id}`, { state: { from } });
  };

  // Fungsi untuk mendownload invoice sebagai PDF
  const handleDownload = () => {
    navigate(`/invoice?id=${invoice.invoice_id}&download=true`, { state: { from } });
  };

  // Fungsi untuk handle aksi Void/Unvoid
  const onVoidButtonClick = () => {
    // Dispatch action untuk update status invoice
    dispatch(toggleVoidExistingInvoice(invoice.invoice_id));
    setIsVoidModalOpen(false); // Tutup modal setelah aksi
  };

  // Fungsi untuk handle aksi delete invoice
  const handleDelete = (invoiceId) => {
    setDeleteInvoiceId(invoiceId); // Set ID invoice yang ingin dihapus
    setIsDeleteModalOpen(true); // Tampilkan modal delete
  };

  // Jika invoice tidak ada, maka tidak akan merender komponen
  if (!invoice) return null;

  return (
    <>
      <td className="w-1/6 py-4 px-4 font-semibold text-indigo-600 dark:text-white hover:underline cursor-pointer text-center">
        <button onClick={handleView}>{invoice.invoice_number}</button>
      </td>

      <td className="w-1/6 py-4 px-4 text-sm text-gray-500 dark:text-gray-300 text-center">
        {invoice.due_date.split('T')[0]}
      </td>

      <td className="w-1/6 py-4 px-4 text-sm text-gray-600 dark:text-gray-300 text-center">
        {invoice.client?.client_name || 'N/A'}
      </td>

      <td className="w-1/6 py-4 px-4 font-medium text-black dark:text-white text-right">
        {formatCurrency(
          invoice.total,
          invoice.client?.currency || 'USD'
        )}
      </td>

      <td className="w-1/6 py-4 px-4 text-center">
        <PaidStatus type={invoice.voided_at != null ? 'void' : invoice.payment_status} />
      </td>

      <td className="w-1/6 py-4 px-4 text-center">
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={handleView}
            className="p-2 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
            title="View"
          >
            <FiEye size={16} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
            title="Download PDF"
          >
            <FiDownload size={16} />
          </button>

          {auth.user.role === 'finance' && (
            <button
              onClick={() => handleDelete(invoice.invoice_id)} // Memanggil handleDelete untuk modal delete
              className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      </td>

      {auth.user.role === 'finance' && (
        <td className="py-5 px-6 text-center">
          <button
            onClick={() => {
              setVoidStatus(invoice.voided_at != null ? 'unvoid' : 'void');
              setIsVoidModalOpen(true);
            }}
            className={`px-4 py-1 text-sm rounded-full shadow-md text-white transition-all duration-150 ${
              invoice.voided_at != null
                ? 'bg-gray-500 hover:bg-gray-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {invoice.voided_at != null ? 'Unvoid' : 'Void'}
          </button>
        </td>
      )}

      {isVoidModalOpen && (
        <VoidModal
          invoice={invoice}
          status={voidStatus}
          onVoidButtonClick={onVoidButtonClick}
          setIsVoidModalOpen={setIsVoidModalOpen}
        />
      )}

      {/* Modal Delete */}
      {isDeleteModalOpen && (
        <DeleteModal
          invoiceId={deleteInvoiceId} // Pass invoiceId ke dalam modal
          onDeleteButtonClick={() => {
            onDelete(deleteInvoiceId); // Panggil fungsi delete
            setIsDeleteModalOpen(false); // Tutup modal setelah delete
          }}
          setIsDeleteModalOpen={setIsDeleteModalOpen} // Fungsi untuk menutup modal
        />
      )}
    </>
  );
}

export default InvoiceCard;
