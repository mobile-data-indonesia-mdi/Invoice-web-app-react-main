import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import leftArrow from '../assets/icon-arrow-left.svg'
import { AnimatePresence, motion } from 'framer-motion'
import PaidStatus from './PaidStatus'
import { useDispatch, useSelector } from 'react-redux'
import invoiceSlice from '../redux/invoiceSlice'
import formatDate from '../functions/formatDate'
import DeleteModal from './DeleteModal'
import CreateInvoice from './CreateInvoice'
import { formatCurrency, formatNumber } from '../functions/formatCurrency'; // Tambahkan formatNumber
import logoMDI from "../assets/logo_mdi.png"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import VoidModal from './VoidModal'; // Tambahkan impor VoidModal

function InvoiceInfo({ onDelete }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false); // Tambahkan state untuk VoidModal
  const [voidStatus, setVoidStatus] = useState(''); // Status void/unvoid

  const params = new URLSearchParams(location.search)
  const invoiceId = params.get('id')
  const isDownload = params.get('download') === 'true';

  const from = location.state?.from || 'dashboard'; // Default ke 'dashboard'

  // ref khusus untuk body invoice yang ingin di-download
  const bodyRef = useRef(null)

  const onMakePaidClick = () => {
    if (invoiceId) {
      dispatch(invoiceSlice.actions.updateInvoiceStatus({ id: invoiceId, status: 'paid' }))
      dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }))
    }
  }

  useEffect(() => {
    if (invoiceId) {
      dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }))
    }
  }, [invoiceId, dispatch])

  useEffect(() => {
    if (!isEditOpen) {
      dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId })); // Refresh data setelah edit
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
  }

  const invoice = useSelector((state) => state.invoices.invoiceById)

  // fungsi untuk download PDF hanya area bodyRef
  const downloadPdf = async () => {
    if (!bodyRef.current) return
    const canvas = await html2canvas(bodyRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'pt', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const imgProps = pdf.getImageProperties(imgData)
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`invoice_${invoice.id}.pdf`)
  }

  const handleGoBack = () => {
    navigate(`/${from}`);
  };

  const onVoidButtonClick = () => {
    if (invoiceId) {
      // Mengubah status berdasarkan status saat ini
      const newStatus = invoice.status === 'void' ? 'pending' : 'void';
      // Update status invoice dengan status yang baru
      dispatch(invoiceSlice.actions.updateInvoiceStatus({ id: invoiceId, status: newStatus }));
      dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }));
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
          key='invoice-info'
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
              Download PDF
            </button>
          </div>

          {/* STATUS BAR */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1e2139] rounded-xl p-6 shadow-md">
            {/* Status Section */}
            <div className="flex items-center gap-3">
              <p className="text-gray-500 dark:text-gray-400 font-medium">Status:</p>
              <PaidStatus type={invoice.status} />
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
                className="text-white bg-red-500 hover:opacity-80 py-2 px-5 rounded-full"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  // Tentukan status berdasarkan kondisi saat ini (tidak tergantung pada status saat itu)
                  setVoidStatus(invoice.status === 'void' ? 'pending' : 'void'); 
                  setIsVoidModalOpen(true);
                }}
                className={`text-black ${
                  invoice.status === 'void' ? 'bg-gray-500' : 'bg-white'
                } hover:opacity-80 py-2 px-5 rounded-full`}
              >
                {invoice.status === 'void' ? 'Unvoid' : 'Void'}
              </button>

              
              {invoice.status === 'pending' && (
                <button
                  onClick={onMakePaidClick}
                  className="text-white bg-[#2dee4d] hover:opacity-80 py-2 px-5 rounded-full"
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
                <p className="font-semibold">{invoice.clientName}</p>
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}, {invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </div>
              <div className="text-sm text-right">
                <p><span className="font-bold">Invoice No.:</span> {invoice.id}</p>
                <p><span className="font-bold">Invoice Date:</span> {formatDate(invoice.createdAt)}</p>
                <p><span className="font-bold">Due Date:</span> {formatDate(invoice.paymentDue)}</p>
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
              {invoice.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-6 p-2 border-t text-sm">
                  <p className="col-span-1">{formatNumber(item.quantity || 0)}</p> {/* Quantity */}
                  <div className="col-span-2">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.description || '-'}</p>
                  </div>
                  <p className="col-span-1 text-right">{formatNumber(item.usage || 0)}</p> {/* Usage */}
                  <p className="col-span-1 text-right">{formatCurrency(item.price || 0, invoice.currency || 'USD')}</p> {/* Price */}
                  <p className="col-span-1 text-right">
                    {formatCurrency(
                      (item.usage || 0) * (item.price || 0), // Amount = Usage * Price
                      invoice.currency || 'USD'
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="text-right mt-6 space-y-2 text-sm">
              <p>
                <span className="font-bold">Subtotal:</span> {formatCurrency(
                  invoice.items.reduce(
                    (sum, item) => sum + (item.usage || 0) * (item.price || 0), // Total hanya menggunakan usage dan price
                    0
                  ),
                  invoice.currency || 'USD'
                )}
              </p>
              <p><span className="font-bold">Tax :</span> -</p>
              <p className="text-lg font-bold">
                <span>Total:</span> {formatCurrency(
                  invoice.items.reduce(
                    (sum, item) => sum + (item.usage || 0) * (item.price || 0), // Total hanya menggunakan usage dan price
                    0
                  ),
                  invoice.currency || 'USD'
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
        <p className='text-center mt-20 dark:text-white'>Loading...</p>
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