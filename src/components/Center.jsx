import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import arrowDown from '../assets/icon-arrow-down.svg';
import plus from '../assets/plus.png';
import InvoiceCard from './InvoiceCard';
import { useDispatch, useSelector } from 'react-redux';
import invoiceSlice from '../redux/invoiceSlice';
import CreateInvoice from './CreateInvoice';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import CreatePayment from './CreatePayment'; // Import komponen CreatePayment
import PaymentCard from './PaymentCard'; // Import PaymentCard

function Center() {
  const location = useLocation();
  const from = location.state?.from || '/';
  const controls = useAnimation();
  const dispatch = useDispatch();
  const filter = ['paid', 'pending', 'draft'];

  // State Hooks
  const [isDropdown, setIsDropdown] = useState(false);
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [openCreatePayment, setOpenCreatePayment] = useState(false); // State untuk membuka modal payment

  // Redux Selectors
  const invoices = useSelector((state) => state.invoices.filteredInvoice);
  const allInvoices = useSelector((state) => state.invoices.allInvoice);
  const payments = useSelector((state) => state.payments.payments); // Ambil data payment dari Redux

  // Fungsi untuk menghapus invoice
  const onDelete = (id) => {
    dispatch(invoiceSlice.actions.deleteInvoice({ id }));
  };

  // Filter invoices berdasarkan status
  useEffect(() => {
    dispatch(invoiceSlice.actions.filterInvoice({ status: filterValue }));
  }, [filterValue, dispatch]);

  // Animasi kontrol
  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    });
  }, [controls]);

  // Sinkronkan menu yang dipilih dengan rute aktif
  useEffect(() => {
    if (location.pathname === '/invoices') {
      setSelectedMenu('invoices');
    } else if (location.pathname === '/payments') {
      setSelectedMenu('payments');
    } else if (location.pathname === '/report') {
      setSelectedMenu('report');
    }
  }, [location.pathname]);

  // Hitung total piutang per klien
  const piutangPerKlien = allInvoices
    .filter((inv) => inv.status === 'pending' || inv.status === 'unpaid')
    .reduce((acc, curr) => {
      const client = curr.clientName || 'Unknown';
      const total = (curr.items || []).reduce((sum, item) => sum + item.quantity * item.price, 0);
      acc[client] = (acc[client] || 0) + total;
      return acc;
    }, {});

  // Render berdasarkan menu yang dipilih
  let content;
  if (selectedMenu === 'dashboard') {
    content = (
      <div className="mt-6 bg-white dark:bg-[#1E2139] rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold dark:text-white mb-3">Total Piutang per Klien</h2>
        {Object.keys(piutangPerKlien).length > 0 ? (
          <ul className="space-y-2">
            {Object.entries(piutangPerKlien).map(([client, total]) => (
              <li key={client} className="text-sm text-gray-700 dark:text-gray-200 flex justify-between">
                <span>{client}</span>
                <span className="font-medium">Rp {total.toLocaleString('id-ID')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Tidak ada piutang saat ini.</p>
        )}
      </div>
    );
  } else if (selectedMenu === 'invoices') {
    content = (
      <div className="mt-10 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="table-fixed w-full bg-white dark:bg-[#1E2139] rounded-lg">
            <thead className="bg-gray-100 dark:bg-[#252945] text-sm text-gray-600 dark:text-gray-300">
              <tr>
                <th className="py-4">Invoice ID</th>
                <th className="py-4">Due Date</th>
                <th className="py-4">Client</th>
                <th className="py-4 text-right">Total</th>
                <th className="py-4 text-center">Status</th>
                <th className="py-4 text-center">Action</th>
                <th className="py-4 text-center">Void</th>
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
                      key={invoice.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-[#252945] transition-all"
                    >
                      <InvoiceCard invoice={invoice} onDelete={onDelete} from={selectedMenu} />
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (selectedMenu === 'payments') {
    content = (
      <div className="mt-10 space-y-4">
        {payments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Tidak ada pembayaran saat ini.
          </p>
        ) : (
          payments.map((payment) => <PaymentCard key={payment.id} payment={payment} />)
        )}
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />
      <div className="dark:bg-[#141625] scrollbar-hide duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 md:px-8 lg:px-12 lg:py-[72px] w-full">
        <motion.div
          key={location.pathname}
          initial={{ x: '0' }}
          animate={{ x: 0 }}
          exit={{ x: '-150%' }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl flex flex-col mx-auto my-auto"
        >
          <div className="min-w-full max-h-[64px] flex items-center justify-between">
            <div>
              <h1 className="lg:text-4xl md:text-2xl text-xl dark:text-white tracking-wide font-semibold">
                {selectedMenu === 'dashboard'
                  ? 'Dashboard'
                  : selectedMenu === 'invoices'
                  ? 'Invoices'
                  : 'Payments'}
              </h1>
              <p className="text-gray-500 font-light">
                {selectedMenu === 'dashboard'
                  ? `Total Piutang per Klien`
                  : `${invoices.length} total invoices.`}
              </p>
            </div>
            <div className="flex max-h-full items-center">
              {selectedMenu !== 'payments' && (
                <>
                  <div className="flex items-center">
                    <p className="hidden md:block dark:text-white font-medium">Filter by status</p>
                    <p className="md:hidden dark:text-white font-medium">Filter</p>
                    <div
                      onClick={() => setIsDropdown((state) => !state)}
                      className="cursor-pointer ml-3"
                    >
                      <motion.img
                        src={arrowDown}
                        animate={isDropdown ? { rotate: -180 } : { rotate: 0 }}
                      />
                    </div>
                  </div>
                  {isDropdown && (
                    <motion.div
                      as="select"
                      className="w-40 bg-white dark:bg-[#1E2139] dark:text-white flex px-6 py-4 flex-col top-[160px] lg:top-[120px] absolute shadow-2xl rounded-xl space-y-2"
                    >
                      {filter.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => setFilterValue(item === filterValue ? '' : item)}
                          className="items-center cursor-pointer flex space-x-2"
                        >
                          <input
                            value={item}
                            checked={filterValue === item}
                            type="checkbox"
                            className="accent-[#7c5dfa] hover:accent-[#7c5dfa]"
                          />
                          <p>{item}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  <button
                    onClick={() => setOpenCreateInvoice(true)}
                    className="hover:opacity-80 ml-4 md:ml-10 flex items-center py-2 px-2 md:space-x-3 space-x-2 bg-[#7c5dfa] rounded-full"
                  >
                    <img src={plus} alt="" />
                    <p className="md:block hidden text-white font-semibold text-lg">New invoice</p>
                    <p className="md:hidden block text-white font-semibold text-base">New</p>
                  </button>
                </>
              )}
              {selectedMenu === 'payments' && (
                <button
                  onClick={() => setOpenCreatePayment(true)}
                  className="hover:opacity-80 ml-4 md:ml-10 flex items-center py-2 px-2 md:space-x-3 space-x-2 bg-[#7c5dfa] rounded-full"
                >
                  <img src={plus} alt="" />
                  <p className="md:block hidden text-white font-semibold text-lg">New payment</p>
                  <p className="md:hidden block text-white font-semibold text-base">New</p>
                </button>
              )}
            </div>
          </div>
          {content}
        </motion.div>
      </div>
      <AnimatePresence>
        {openCreateInvoice && (
          <CreateInvoice openCreateInvoice={openCreateInvoice} setOpenCreateInvoice={setOpenCreateInvoice} />
        )}
        {openCreatePayment && (
          <CreatePayment setOpenCreatePayment={setOpenCreatePayment} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Center;
