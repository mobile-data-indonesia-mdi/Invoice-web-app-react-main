import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';   // Import useDispatch
import invoiceSlice from '../redux/invoiceSlice';  // Import invoiceSlice
import PaidStatus from './PaidStatus';
import { formatCurrency } from '../functions/formatCurrency';
import { FiEye, FiDownload, FiTrash2 } from 'react-icons/fi';
import VoidModal from './VoidModal';
import DeleteModal from './DeleteModal'; // Import DeleteModal

function InvoiceCard({ invoice, onDelete, from }) {
  const dispatch = useDispatch();    // Inisialisasi dispatch
  const navigate = useNavigate();
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidStatus, setVoidStatus] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State untuk modal delete
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(null); // State untuk menyimpan invoice ID yang akan dihapus

  // Fungsi untuk menavigasi ke halaman invoice
  const handleView = () => {
    navigate(`/invoice?id=${invoice.id}`, { state: { from } });
  };

  // Fungsi untuk mendownload invoice sebagai PDF
  const handleDownload = () => {
    navigate(`/invoice?id=${invoice.id}&download=true`, { state: { from } });
  };

  // Fungsi untuk handle aksi Void/Unvoid
  const onVoidButtonClick = () => {
    const newStatus = invoice.status === 'void' ? 'pending' : 'void';
    // Dispatch action untuk update status invoice
    dispatch(invoiceSlice.actions.updateInvoiceStatus({ id: invoice.id, status: newStatus }));
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
      <td className="w-1/6 py-4 px-4 font-semibold text-indigo-600 dark:text-white hover:underline cursor-pointer">
        <button onClick={handleView}>{invoice.id}</button>
      </td>

      <td className="w-1/6 py-4 px-4 text-sm text-gray-500 dark:text-gray-300">
        {invoice.paymentDue}
      </td>

      <td className="w-1/6 py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
        {invoice.clientName}
      </td>

      <td className="w-1/6 py-4 px-4 font-medium text-black dark:text-white text-right">
        {formatCurrency(
          invoice.items.reduce((sum, item) => sum + (item.usage || 0) * (item.price || 0), 0),
          invoice.currency || 'USD'
        )}
      </td>

      <td className="w-1/6 py-4 px-4 text-center">
        <PaidStatus type={invoice.status} />
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

          <button
            onClick={() => handleDelete(invoice.id)} // Memanggil handleDelete untuk modal delete
            className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>

      <td className="py-5 px-6 text-center">
      <button
        onClick={() => {
            setVoidStatus(invoice.status === 'void' ? 'unvoid' : 'void'); 
            setIsVoidModalOpen(true);
        }}
        className={`px-4 py-1 text-sm rounded-full shadow-md text-white transition-all duration-150 ${
            invoice.status === 'void'
            ? 'bg-gray-500 hover:bg-gray-600'
            : 'bg-red-500 hover:bg-red-600'
        }`}
        >
        {invoice.status === 'void' ? 'Unvoid' : 'Void'}
        </button>
      </td>

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
