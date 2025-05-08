import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import leftArrow from '../assets/icon-arrow-left.svg'
import { AnimatePresence, motion } from 'framer-motion'
import PaidStatus from './PaidStatus'
import { useDispatch, useSelector } from 'react-redux'
import {editExistingInvoice, fetchInvoiceById, toggleVoidExistingInvoice} from '../redux/invoiceSlice'
import formatDate from '../functions/formatDate'
import DeleteModal from './DeleteModal'
import CreateInvoice from './CreateInvoice'
import { formatCurrency, formatNumber } from '../functions/formatCurrency'; // Tambahkan formatNumber
import logoMDI from "../assets/logo_mdi.png"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import VoidModal from './VoidModal' // Tambahkan impor VoidModal

function InvoiceInfo({ onDelete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false); // Tambahkan state untuk VoidModal
  const [voidStatus, setVoidStatus] = useState(''); // Status void/unvoid
  const [isDownloading, setIsDownloading] = useState(false); // State untuk menandakan apakah sedang mendownload

  const params = new URLSearchParams(location.search);
  const invoiceId = params.get('id');
  const isDownload = params.get('download') === 'true';

  const from = location.state?.from || 'dashboard'; // Default ke 'dashboard'

  // ref khusus untuk body invoice yang ingin di-download
  const bodyRef = useRef(null);

  const onMakePaidClick = async () => {
    if (invoiceId) {
      await dispatch(editExistingInvoice({invoice_id: invoiceId, payment_status: 'paid'}))
      await dispatch(fetchInvoiceById(invoiceId))
    }
  };

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceById(invoiceId));
    }
  }, [invoiceId, dispatch])

  useEffect(() => {
    if (!isEditOpen) {
      dispatch(fetchInvoiceById(invoiceId)); // Refresh data setelah edit
      console.log("Invoice ID setelah edit: ", invoice);
    }
  }, [isEditOpen, invoiceId, dispatch]);

  useEffect(() => {
    if (isDownload) {
      downloadPdf(); // Fungsi download PDF
    }
  }, [isDownload]);

  const onDeleteButtonClick = () => {
    navigate('/')
    setIsDeleteModalOpen(false)
    onDelete(invoiceId)
  };

  const invoice = useSelector((state) => state.invoices.invoiceById);

  // fungsi untuk download PDF hanya area bodyRef
  const downloadPdf = async () => {
    if (!bodyRef.current) return

    setIsDownloading(true);

    const canvas = await html2canvas(bodyRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'pt', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const imgProps = pdf.getImageProperties(imgData)
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`invoice_${invoice.invoice_number}.pdf`)

    setIsDownloading(false);
  }

  const handleGoBack = () => {
    navigate(`/${from}`);
  };

  const onVoidButtonClick = async () => {
    if (invoiceId) {
      // Update status invoice dengan status yang baru
      await dispatch(toggleVoidExistingInvoice(invoiceId));
      await dispatch(fetchInvoiceById(invoiceId));
      setIsVoidModalOpen(false); // Menutup modal setelah status diubah
    }
  }

  return (
    <div>
      <button
        onClick={handleGoBack}
        className='flex items-center space-x-4 group dark:text-white font-thin'
      >
        <img src={leftArrow} alt="go back" />
        <p className='group-hover:opacity-80'>Go back</p>
      </button>
      {invoice ? (
        <motion.div
          key='invoice?.invoice_number'
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          exit={{ x: '200%' }}
          transition={{ duration: 0.5 }}
          className='dark:bg-[#141625] mx-auto duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 md:px-8 lg:px-12 max-w-4xl lg:py-[72px]'
        >
          {/* HEADER: Go back + Download PDF */}
          <div className='flex justify-between items-center mb-6'>
            <button
              onClick={handleGoBack}
              className='flex items-center space-x-4 group dark:text-white font-thin'
            >
              <img src={leftArrow} alt="go back" />
              <p className='group-hover:opacity-80'>Go back</p>
            </button>
            <button
              onClick={downloadPdf}
              className='text-white bg-[#7c5dfa] hover:opacity-80 p-2 px-4 rounded-full text-sm'
            >
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>

          {/* STATUS BAR */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1e2139] rounded-xl p-6 shadow-md">
            {/* Status Section */}
            <div className="flex items-center gap-3">
              <p className="text-gray-500 dark:text-gray-400 font-medium">Status:</p>
              <PaidStatus type={invoice.voided_at != null ? 'void' : invoice.payment_status} />
            </div>

            {/* Actions Section */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-[#7e88c3] bg-slate-100 dark:bg-[#252945] hover:opacity-80 py-2 px-5 rounded-full"
              >
                Edit
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-white bg-red-900 hover:opacity-80 py-2 px-5 rounded-full"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  // Tentukan status berdasarkan kondisi saat ini (tidak tergantung pada status saat itu)
                  setVoidStatus(invoice.voided_at != null ? null : invoice.payment_status);
                  setIsVoidModalOpen(true);
                }}
                className={`text-white ${
                  invoice.voided_at != null ? ' bg-gray-500' : 'bg-red-500'
                } hover:opacity-80 py-2 px-5 rounded-full`}
              >
                {invoice.voided_at != null ? 'Unvoid' : 'Void'}
              </button>
              
              {invoice.payment_status !== 'paid' && (
                <button
                  onClick={onMakePaidClick}
                  className="text-white bg-green-500 hover:opacity-80 py-2 px-5 rounded-full"
                >
                  Mark as Paid
                </button>
              )}
              
            </div>
          </div>


          {/* INVOICE BODY */}
          <div
            ref={bodyRef} // <-- Hanya area ini yang akan di-capture PDF
            className="mt-6 bg-white p-6 shadow-md text-black font-sans"
            style={{ backgroundColor: '#ffffff' }} // Tambahkan warna latar belakang putih
          >
            {/* Header & Logo */}
            <div className="border-b pb-4 mb-6">
              <div className="flex justify-between items-center">
                <img src={logoMDI} alt="Company Logo" className="h-12" />
                <div className="text-right text-sm">
                  <p className="font-bold text-lg">PT Mobile Data Indonesia</p>
                  <p>The Victoria Building 9th Fl</p>
                  <p>Jl Tomang Raya Kav 35–37 Jakarta 11440</p>
                </div>
              </div>
            </div>

            {/* Recipient & Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-4 mb-6">
              <div>
                <p className="text-xs uppercase font-bold mb-2">To</p>
                <p className="font-semibold">{invoice.client.client_name}</p>
                <p>{invoice.client.client_address}</p>
                <p>{invoice.client.postal_code}</p>
                <p>{invoice.client.country}</p>
              </div>
              <div className="text-sm text-right">
                <p><span className="font-bold">Invoice No.:</span> {invoice.invoice_number}</p>
                <p><span className="font-bold">Invoice Date:</span> {formatDate(invoice.issue_date)}</p>
                <p><span className="font-bold">Due Date:</span> {formatDate(invoice.due_date)}</p>
              </div>
            </div>

            {/* Item Table */}
            <div className="border-t border-b">
              <div className="grid grid-cols-6 font-semibold bg-gray-100 p-2">
                <p className="col-span-1">Qty</p>
                <p className="col-span-2">Description</p>
                <p className="col-span-1 text-right">Usage</p>
                <p className="col-span-1 text-right">Price</p>
                <p className="col-span-1 text-right">Amount</p>
              </div>
              {invoice.invoice_details.map((item, idx) => (
                <div key={idx} className="grid grid-cols-6 p-2 border-t text-sm">
                  <p className="col-span-1">{formatNumber(idx+1)}</p> {/* Quantity */}
                  <div className="col-span-2">
                    <p className="font-medium">{item.transaction_note}</p>
                  </div>
                  <p className="col-span-1 text-right">{formatNumber(item.delivery_count || 0)}</p> {/* Usage */}
                  <p className="col-span-1 text-right">{formatCurrency(item.price_per_delivery || 0, invoice.client.currency || 'USD')}</p> {/* Price */}
                  <p className="col-span-1 text-right">
                    {formatCurrency(
                      (item.delivery_count || 0) * (item.price_per_delivery || 0), // Amount = Usage * Price
                      invoice.client.currency || 'USD'
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="text-right mt-6 space-y-2 text-sm">
              <p>
                <span className="font-bold">Subtotal:</span> {formatCurrency(
                  invoice.invoice_details.reduce(
                    (sum, item) => sum + (item.delivery_count || 0) * (item.price_per_delivery || 0), // Total hanya menggunakan usage dan price
                    0
                  ),
                  invoice.client.currency || 'USD'
                )}
              </p>
              <p>
                <span className="font-bold">Tax :</span> {formatCurrency(
                  invoice.tax_amount || 0,
                  invoice.client.currency || 'USD'
                )}
              </p>
              <p className="text-lg font-bold">
                <span>Total:</span> {formatCurrency(
                  invoice.total,
                  invoice.client.currency || 'USD'
                )}
              </p>
            </div>

            {/* Signature & Bank Info */}
            <div className="flex flex-col md:flex-row justify-between items-start mt-10 border-t pt-6 text-sm">
              <div>
                <p className="mb-1 font-semibold">For and on behalf of</p>
                <p>PT Mobile Data Indonesia</p>
                <div className="h-16 border-b my-4"></div>
                <p className="mt-2">Authorized Signature</p>
              </div>
              <div className="text-right mt-6 md:mt-0">
                <p className="font-semibold">Please transfer payment to:</p>
                <p><strong>Bank BCA</strong></p>
                <p>a/c #: 3100437057</p>
                <p>a/n PT Mobile Data Indonesia</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className='flex justify-center items-center min-h-screen'>
          <p className='text-gray-500 dark:text-white'>Loading...</p>
        </div>
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteButtonClick={onDeleteButtonClick}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          invoiceId={invoice.id}
        />
      )}

      {isVoidModalOpen && (
        <VoidModal
          invoice={invoice}
          status={voidStatus}
          onVoidButtonClick={onVoidButtonClick}
          setIsVoidModalOpen={setIsVoidModalOpen}
        />
      )}

      <AnimatePresence>
        {isEditOpen && (
          <CreateInvoice
            invoice={invoice}
            type='edit'
            setOpenCreateInvoice={setIsEditOpen}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default InvoiceInfo