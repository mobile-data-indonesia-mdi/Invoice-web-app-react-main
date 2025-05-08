import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import invoiceSlice, { createNewInvoice, editExistingInvoice} from '../redux/invoiceSlice';
import { formatCurrency } from '../functions/formatCurrency';
import {
  validateClientName,
  validateClientPostCode,
  validateClientStreetAddress,
  validateItemCount,
  validateItemName,
  validateItemPrice,
  validateClientCountry,
} from '../functions/createInvoiceValidator';
import moment from 'moment';

function CreateInvoice({ openCreateInvoice, setOpenCreateInvoice, invoice, type }) {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValidatorActive, setIsValidatorActive] = useState(false);

  // Invoice state
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(''); // Tambahkan state untuk tanggal
  const [dueDate, setDueDate] = useState(''); // Tambahkan
  const [tax, setTax] = useState(0); // State untuk pajak

  // Invoice details state
  const [item, setItem] = useState([{ name: '', quantity: 1, price: 0, total: 0, id: uuidv4() }]);

  // Client state
  const [clientName, setClientName] = useState('');
  const [clientStreet, setClientStreet] = useState('');
  const [clientPostCode, setClientPostCode] = useState('');
  const [clientCountry, setClientCountry] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [savedClients, setSavedClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  const onDelete = (id) => {
    setItem((prev) => prev.filter((el) => el.id !== id));
  };

  const handleOnChange = (id, e) => {
    const { name, value } = e.target;

    const updatedItems = item.map((i) =>
        i.id === id
            ? {
              ...i,
              [name]: name === 'price' || name === 'usage' ? value : value, // Biarkan nilai tetap string
              total:
                  name === 'price' || name === 'usage'
                      ? parseFloat(
                          ((name === 'usage' ? parseFloat(value) || 0 : i.usage || 0) *
                              (name === 'price' ? parseFloat(value) || 0 : i.price || 0)).toFixed(2)
                      )
                      : i.total, // Hitung total hanya jika `price` atau `usage` berubah
            }
            : i
    );
    setItem(updatedItems);
  };

  const itemsValidator = () => {
    return item.every(
        (i) =>
            validateItemName(i.name) &&
            validateItemCount(i.quantity) &&
            validateItemPrice(i.price)
    );
  };

  const validator = () => {
    return (
        invoiceNumber.trim() !== '' &&
        invoiceDate.trim() !== '' &&
        dueDate.trim() !== '' &&
        validateClientName(clientName) &&
        validateClientStreetAddress(clientStreet) &&
        validateClientPostCode(clientPostCode) &&
        validateClientCountry(clientCountry) &&
        itemsValidator()
    );
  };

  useEffect(() => {
    if (type === 'edit' && isFirstLoad) {
      setClientName(invoice.client.client_name || '');
      setClientStreet(invoice.client.client_address || '');
      setClientPostCode(invoice.client.postal_code || '');
      setClientCountry(invoice.client.country || '');
      const itemsWithId = invoice.invoice_details.map((invoice_detail, index) => ({
        id: invoice_detail.invoice_detail_id,
        name: invoice_detail.transaction_note || '',
        quantity: index + 1,
        usage: invoice_detail.delivery_count || 0,
        price: invoice_detail.price_per_delivery || 0,
      }));
      setItem(itemsWithId);
      setCurrency(invoice.client.currency || 'USD');
      setInvoiceDate(moment(invoice.issue_date).format('YYYY-MM-DD') || '');
      setInvoiceNumber(invoice.invoice_number || '');
      setDueDate(moment(invoice.due_date).format('YYYY-MM-DD') || '');
      setTax(parseInt(invoice.tax_rate * 100) || 0); //
      setIsFirstLoad(false);
    }
  }, [invoice, isFirstLoad, type]);

  useEffect(() => {
    const clientsFromStorage = JSON.parse(localStorage.getItem('savedClients')) || [];
    setSavedClients(clientsFromStorage);
  }, []);

  const saveClient = () => {
    const newClient = {
      clientName,
      clientStreet,
      clientPostCode,
      clientCountry,
      currency,
    };

    const updatedClients = [...savedClients, newClient];
    setSavedClients(updatedClients);
    localStorage.setItem('savedClients', JSON.stringify(updatedClients));
  };

  const subtotal = item.reduce((sum, i) => sum + (i.usage || 0) * (i.price || 0), 0);
  const taxAmount = tax ? (subtotal * parseFloat(tax)) / 100 : 0;

  const onSubmit = async () => {
    console.log("Submitting form...");

    let payload  = {
      invoice_number: invoiceNumber,
      issue_date: invoiceDate,
      due_date: dueDate,
      tax_rate: parseFloat(tax),
      tax_invoice_number: "TAX-INV-100",
      client_id: "9fd5075c-e52b-4264-a3f0-551170e2281d", // Keperluan testing, ganti dengan id client yang sesuai
      invoice_details: item.map((i) => ({
        ...i,
        transaction_note: i.name,
        delivery_count: parseInt(i.usage),
        price_per_delivery: parseFloat(i.price),
        //total: parseFloat((i.usage || 0) * (i.price || 0)).toFixed(2), // Total hanya menggunakan usage dan price
      })),
    };

    if (type === 'edit') {
      payload.tax_amount = taxAmount;
      payload.sub_total = subtotal;
      payload.total = taxAmount + subtotal;

      console.log("taxAmount: ", taxAmount);
      console.log("tax_amount: ", payload.tax_amount);
      await dispatch(editExistingInvoice({ id: invoice.invoice_id, invoiceData: payload }));
    } else {
      await dispatch(createNewInvoice(payload));
    }

    console.log("Payload", payload);

    // Perbarui filter untuk memastikan invoice baru muncul
    await dispatch(invoiceSlice.actions.filterInvoice({ status: '' }));

    setOpenCreateInvoice(false);
  };

  return (
      <div
          onClick={(e) => e.target === e.currentTarget && setOpenCreateInvoice(false)}
          className="fixed inset-0 bg-[#000005be]"
      >
        <motion.div
            key="createInvoice-sidebar"
            initial={{ x: -500, opacity: 0 }}
            animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 40, duration: 0.4 } }}
            exit={{ x: -700, transition: { duration: 0.2 } }}
            className="scrollbar-hide flex flex-col dark:text-white dark:bg-[#141625] bg-white md:pl-[150px] py-16 px-6 h-screen md:w-[1024px] md:rounded-r-3xl" // Lebar diperbesar menjadi 1024px
        >
          <h1 className="font-semibold dark:text-white text-3xl mb-6">
            {type === 'edit' ? 'Edit' : 'Create'} Invoice
          </h1>

          <div className="overflow-y-scroll scrollbar-hide mb-8 space-y-6">
            {/* Bill To */}
            <div>
              <h2 className="text-[#7c5dfa] mb-2 font-medium">Bill To</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Select Client */}
                <div className="col-span-3">
                  <label className="text-gray-400 dark:text-gray-300 block mb-1">Select Client</label>
                  <select
                      value={selectedClient}
                      onChange={(e) => {
                        const client = savedClients.find((c) => c.clientName === e.target.value);
                        if (client) {
                          setClientName(client.clientName);
                          setClientStreet(client.clientStreet);
                          setClientPostCode(client.clientPostCode);
                          setClientCountry(client.clientCountry);
                          setCurrency(client.currency);
                        }
                        setSelectedClient(e.target.value);
                      }}
                      className="w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white border-gray-300 dark:border-gray-600"
                  >
                    <option value="">Select a saved client</option>
                    {savedClients.map((client, idx) => (
                        <option key={idx} value={client.clientName}>
                          {client.clientName}
                        </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="text-gray-400 dark:text-gray-300 block mb-1">Client Name</label>
                  <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                          isValidatorActive && !validateClientName(clientName) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-gray-400 dark:text-gray-300 block mb-1">Street Address</label>
                  <input
                      value={clientStreet}
                      onChange={(e) => setClientStreet(e.target.value)}
                      className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                          isValidatorActive && !validateClientStreetAddress(clientStreet) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                </div>
                <div>
                  <label className="text-gray-400 dark:text-gray-300 block mb-1">Post Code</label>
                  <input
                      value={clientPostCode}
                      onChange={(e) => setClientPostCode(e.target.value)}
                      className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                          isValidatorActive && !validateClientPostCode(clientPostCode) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                </div>
                <div>
                  <label className="text-gray-400 dark:text-gray-300 block mb-1">Country</label>
                  <input
                      value={clientCountry}
                      onChange={(e) => setClientCountry(e.target.value)}
                      className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                          isValidatorActive && !validateClientCountry(clientCountry) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                </div>

                {/* Save Client Button */}
                <div className="col-span-3">
                  <button
                    onClick={saveClient}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:opacity-80 mt-4"
                  >
                    Save Client
                  </button>
                </div>

                {/* Invoice Number */}
                <div className="col-span-3">
                  <label className="text-gray-400 dark:text-gray-300 block mb-1">Invoice Number</label>
                  <input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                          isValidatorActive && invoiceNumber.trim() === '' ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                </div>
                {/* Invoice Date */}
                <div className="col-span-3">
                  <label className="text-gray-400 dark:text-gray-300 block mb-1">Invoice Date</label>
                  <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                          isValidatorActive && invoiceDate.trim() === '' ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                </div>
                {/* Due Date */}
                <div className="col-span-3">
                  <label className="text-gray-400 dark:text-gray-300 block mb-1">Due Date</label>
                  <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                          isValidatorActive && dueDate.trim() === '' ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Item List */}
            <div>
              <h2 className="text-[#7c5dfa] text-xl font-semibold mb-4">Item List</h2>
              <div className="mb-4">
                <label className="text-gray-400 dark:text-gray-300 block mb-1">Currency</label>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full py-2 px-4 border rounded dark:bg-[#1E2139] dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="USD">USD</option>
                  <option value="IDR">IDR</option>
                </select>
              </div>
              {item.map((itemDetails, idx) => (
                  <div
                      key={itemDetails.id}
                      className="flex items-center justify-between p-4 mb-4 bg-gray-100 dark:bg-[#252945] rounded-lg shadow-md"
                  >
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Item Name</label>
                      <input
                          type="text"
                          name="name"
                          value={itemDetails.name}
                          onChange={(e) => handleOnChange(itemDetails.id, e)}
                          className="w-full py-2 px-4 mt-1 rounded border dark:bg-[#1E2139] dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="flex-1 mx-2">
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Quantity</label>
                      <input
                          type="number"
                          name="quantity"
                          value={itemDetails.quantity}
                          onChange={(e) => handleOnChange(itemDetails.id, e)}
                          className="w-full py-2 px-4 mt-1 rounded border dark:bg-[#1E2139] dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="flex-1 mx-2">
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Usage</label>
                      <input
                          type="number"
                          name="usage"
                          value={itemDetails.usage || ''} // Tampilkan kosong jika nilai 0
                          onChange={(e) => handleOnChange(itemDetails.id, e)}
                          className="w-full py-2 px-4 mt-1 rounded border dark:bg-[#1E2139] dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="flex-1 mx-2">
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price ({currency})</label>
                      <input
                          type="number"
                          name="price"
                          value={itemDetails.price || ''} // Tampilkan kosong jika nilai 0
                          onChange={(e) => handleOnChange(itemDetails.id, e)}
                          className="w-full py-2 px-4 mt-1 rounded border dark:bg-[#1E2139] dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="flex-1 mx-2">
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Total ({currency})</label>
                      <input
                          type="text"
                          value={(itemDetails.usage * itemDetails.price).toFixed(2)} // Total hanya menggunakan usage dan price
                          readOnly
                          className="w-full py-2 px-4 mt-1 rounded border bg-gray-200 dark:bg-[#1E2139] dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <button
                        onClick={() => onDelete(itemDetails.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </div>
              ))}
              <button
                  onClick={() =>
                      setItem((prev) => [
                        ...prev,
                        {
                          name: '',
                          quantity: prev.length + 1, // Quantity otomatis bertambah
                          usage: 0, // Default usage = 0
                          price: 0,
                          total: 0,
                          id: uuidv4(),
                        },
                      ])
                  }
                  className="w-full py-2 rounded bg-gray-200 dark:bg-[#252945] text-center hover:opacity-80"
              >
                + Add New Item
              </button>
            </div>

            {/* Tax Input */}
            <div className="col-span-3">
              <label className="text-gray-400 dark:text-gray-300 block mb-1">Tax (%)</label>
              <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  placeholder="Enter tax percentage (e.g., 11)"
                  className="w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Total Section */}
            <div className="text-right mt-6 space-y-2 text-sm">
              <p>
                <span className="font-bold">Subtotal:</span> {formatCurrency(
                  item.reduce((sum, i) => sum + (i.usage || 0) * (i.price || 0), 0),
                  currency
              )}
              </p>
              <p>
                <span className="font-bold">Tax ({tax || 0}%):</span> {formatCurrency(
                  tax ? (item.reduce((sum, i) => sum + (i.usage || 0) * (i.price || 0), 0) * parseFloat(tax)) / 100 : 0,
                  currency
              )}
              </p>
              <p className="text-lg font-bold">
                <span>Total:</span> {formatCurrency(subtotal + taxAmount, currency)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
                onClick={() => setOpenCreateInvoice(false)}
                className="px-8 py-4 rounded bg-gray-200 dark:bg-[#252945] hover:opacity-80"
            >
              Discard
            </button>
            <button
                onClick={() => {
                  setIsValidatorActive(true);
                  if (validator()) onSubmit();
                }}
                className="px-8 py-4 rounded bg-[#7c5dfa] text-white hover:opacity-80"
            >
              Save & Send
            </button>
          </div>
        </motion.div>
      </div>
  );
}

export default CreateInvoice;