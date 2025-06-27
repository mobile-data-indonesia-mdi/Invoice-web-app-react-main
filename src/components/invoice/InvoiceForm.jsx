import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import { FaTrash } from "react-icons/fa";

import { invoiceFormValidator } from "@/functions/validator/invoiceFormValidator.js";
import invoiceSlice, {
  createNewInvoice,
  editInvoice,
  fetchAllInvoices,
} from "@/redux/invoiceSlice.js";
import { formatCurrency } from "@/functions/formatCurrency.js";
import { fetchAllClients } from "@/redux/clientSlice.js";

// Validation function
function validator(formData) {
  const msg = invoiceFormValidator(formData);
  if (msg !== true) {
    alert(msg);
    return false;
  }
  return true;
}

function calculateTotal(formData) {
  const subtotal = formData.items.reduce(
    (sum, i) => sum + (i.usage || 0) * (i.price || 0),
    0
  );
  const taxAmount = formData.tax
    ? (subtotal * parseFloat(formData.tax)) / 100
    : 0;
  const total = subtotal + taxAmount;

  return {
    subtotal: subtotal,
    taxAmount: taxAmount,
    total: total,
  };
}

function InvoiceForm({ setOpenCreateInvoice, invoice, type }) {
  if (type === "edit" && !invoice) {
    return <div className="p-8 text-center">Loading invoice data...</div>;
  }

  const dispatch = useDispatch();

  const errorPayment = useSelector((state) => state.invoices.error);

  // State Hooks
  const [isValidatorActive, setIsValidatorActive] = useState(false);

  // Invoice Form State
  const [formData, setFormData] = useState({
    invoiceNumber: type === "edit" ? invoice.invoice_number : "",
    invoiceDate:
      type === "edit" ? moment(invoice.issue_date).format("YYYY-MM-DD") : "",
    dueDate:
      type === "edit" ? moment(invoice.due_date).format("YYYY-MM-DD") : "",
    tax: type === "edit" ? parseInt(invoice.tax_rate * 100) : 0,
    taxInvoiceNumber: type === "edit" ? invoice.tax_invoice_number : "",
    items:
      type === "edit"
        ? invoice.invoice_details.map((detail, index) => ({
            name: detail.transaction_note || "",
            quantity: index + 1 || 1,
            usage: detail.delivery_count || 0,
            price: detail.price_per_delivery || 0,
            total:
              (detail.delivery_count || 0) * (detail.price_per_delivery || 0),
            id: detail.invoice_detail_id || uuidv4(),
          }))
        : [
            {
              name: "",
              quantity: 1,
              usage: 0,
              price: 0,
              total: 0,
              id: uuidv4(),
            },
          ],
  });

  // Client State
  const clients = useSelector((state) => state.clients.allClients) || [];
  const [selectedClient, setSelectedClient] = useState(
    type === "edit"
      ? clients.find((c) => c.client_id === invoice.client_id)
      : {
          client_id: "",
          client_name: "",
          currency: "USD",
          client_address: "",
          country: "",
          postal_code: "",
          client_phone: "",
        }
  );

  const allInvoices = useSelector((state) => state.invoices.allInvoices);
  const otherInvoices =
    type === "edit"
      ? allInvoices.filter((inv) => inv.invoice_id !== invoice.invoice_id)
      : allInvoices;
  const existingInvoiceNumbers = otherInvoices.map((inv) => inv.invoice_number);
  const existingTaxInvoiceNumbers = otherInvoices.map(
    (inv) => inv.tax_invoice_number
  );

  // Event Handlers
  const onDelete = (id) =>
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((el) => el.id !== id),
    }));

  const handleInputChange = (e, id = null) => {
    const { name, value } = e.target;

    if (id) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === id
            ? {
                ...i,
                [name]: value,
                total: ["price", "usage"].includes(name)
                  ? parseFloat(
                      (
                        (name === "usage" ? parseFloat(value) || 0 : i.usage) *
                        (name === "price" ? parseFloat(value) || 0 : i.price)
                      ).toFixed(2)
                    )
                  : i.total,
              }
            : i
        ),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Get subtotal, tax amount, and total
  const { subtotal, taxAmount, total } = calculateTotal(formData);

  const onSubmit = async () => {
    if (existingInvoiceNumbers.includes(formData.invoiceNumber)) {
      alert(
        `Invoice number "${formData.invoiceNumber}" already exists. \nPlease use a different number.`
      );
      return;
    }

    if (existingTaxInvoiceNumbers.includes(formData.taxInvoiceNumber)) {
      alert(
        `Tax invoice number "${
          formData.taxInvoiceNumber || ""
        }" already exists.\nPlease use a different number.`
      );
      return;
    }

    const payload = {
      invoice_number: formData.invoiceNumber,
      issue_date: formData.invoiceDate,
      due_date: formData.dueDate,
      tax_rate: parseFloat(formData.tax),
      tax_invoice_number: formData.taxInvoiceNumber,
      client_id: selectedClient.client_id,
      invoice_details: formData.items.map((i) => ({
        transaction_note: i.name,
        delivery_count: parseInt(i.usage),
        price_per_delivery: parseFloat(i.price),
      })),
      ...(type === "edit" && {
        tax_amount: taxAmount,
        sub_total: subtotal,
        total: total,
      }),
    };

    if (type === "edit") {
      await dispatch(
        editInvoice({ id: invoice.invoice_id, invoiceData: payload })
      );
    } else {
      await dispatch(createNewInvoice(payload));
    }

    await dispatch(invoiceSlice.actions.filterInvoice({ status: "" }));
    setOpenCreateInvoice(false);
  };

  // Fetch clients only if not loaded
  useEffect(() => {
    if (clients.length === 0) dispatch(fetchAllClients());
  }, [clients.length, dispatch]);

  // Fetch invoices only if not loaded
  useEffect(() => {
    if (allInvoices.length === 0) dispatch(fetchAllInvoices());
  }, [allInvoices.length, dispatch]);

  // Show error alert if payment error occurs
  useEffect(() => {
    if (errorPayment?.message) {
      alert(errorPayment.message);
      dispatch(invoiceSlice.actions.resetError());
    }
  }, [errorPayment, dispatch]);

  return (
    <div
      onClick={(e) =>
        e.target === e.currentTarget && setOpenCreateInvoice(false)
      }
      className="fixed inset-0 bg-[#000005be]"
    >
      <motion.div
        key="createInvoiceApi-sidebar"
        initial={{ x: -500, opacity: 0 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 40,
            duration: 0.4,
          },
        }}
        exit={{ x: -700, transition: { duration: 0.2 } }}
        className="scrollbar-hide flex flex-col dark:text-white dark:bg-[#141625] bg-white py-16 px-6 h-screen md:w-[1024px] md:rounded-r-3xl"
      >
        <h1 className="font-semibold dark:text-white text-3xl mt-6 mb-6">
          {type === "edit" ? "Edit" : "Create"} Invoice
        </h1>

        <div className="overflow-y-scroll scrollbar-hide mb-8 space-y-6">
          {/* Bill To */}
          <h2 className="text-[#7c5dfa] mb-2 font-medium">Bill To</h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Select Client */}
            <div className="col-span-3">
              <label className="text-gray-400 dark:text-gray-300 block mb-1">
                Select Client
              </label>
              <select
                value={selectedClient.client_id || ""}
                onChange={(e) => {
                  const clientId = e.target.value;
                  const clientData = clients.find(
                    (client) => client.client_id === clientId
                  );
                  setSelectedClient(clientData ? { ...clientData } : null);
                }}
                className="w-full py-2 px-4 border rounded dark:bg-[#1E2139] dark:text-white border-gray-300 dark:border-gray-600"
                required
              >
                <option value="" disabled>
                  Select a client
                </option>
                {clients.length === 0 ? (
                  <option value="" disabled>
                    No clients available
                  </option>
                ) : (
                  clients.map((client) => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.client_name}
                    </option>
                  ))
                )}
              </select>

              {/* Display selected client card */}
              {selectedClient.client_id !== "" && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-[#252945] rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">
                    {selectedClient.client_name}
                  </h3>
                  <table className="mt-4 border-collapse">
                    <tbody>
                      {[
                        {
                          label: "Address",
                          value: selectedClient.client_address,
                        },
                        { label: "Country", value: selectedClient.country },
                        {
                          label: "Postal Code",
                          value: selectedClient.postal_code,
                        },
                        { label: "Currency", value: selectedClient.currency },
                        {
                          label: "Telephone",
                          value: selectedClient.client_phone,
                        },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="text-gray-500 dark:text-gray-400">
                            {item.label}
                          </td>
                          <td className="text-gray-500 dark:text-gray-400 px-2">
                            :
                          </td>
                          <td className="text-gray-800 dark:text-white">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Invoice Number, Invoice Date, Due Date Input */}
            {[
              {
                type: "text",
                label: "Invoice Number",
                name: "invoiceNumber",
                placeholder: "Enter invoice number",
              },
              { type: "date", label: "Invoice Date", name: "invoiceDate" },
              { type: "date", label: "Due Date", name: "dueDate" },
            ].map((item, index) => (
              <div key={index} className="col-span-3">
                <label className="text-gray-400 dark:text-gray-300 block mb-1">
                  {item.label}
                </label>
                <input
                  type={item.type}
                  name={item.name}
                  value={formData[item.name]}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={item.placeholder || ""}
                  className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                    isValidatorActive &&
                    String(formData[item.name]).trim() === ""
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Item List */}
          <div>
            <h2 className="text-[#7c5dfa] text-xl font-semibold mb-4">
              Item List
            </h2>
            <div className="mb-4">
              <label className="text-gray-400 dark:text-gray-300 block mb-1">
                Currency
              </label>
              <select
                value={selectedClient.currency}
                className="w-full py-2 px-4 border rounded dark:bg-[#1E2139] dark:text-white border-gray-300 dark:border-gray-600"
                disabled
              >
                <option value="USD">USD</option>
                <option value="IDR">IDR</option>
              </select>
            </div>
            {formData.items.map((itemDetails) => (
              <div
                key={itemDetails.id}
                className="flex items-center justify-between p-4 mb-4 bg-gray-100 dark:bg-[#252945] rounded-lg shadow-md"
              >
                {[
                  { type: "text", label: "Item Name", name: "name" },
                  {
                    type: "number",
                    label: "Quantity",
                    name: "quantity",
                    readOnly: true,
                  },
                  { type: "number", label: "Usage", name: "usage" },
                  {
                    type: "number",
                    label: `Price (${selectedClient.currency})`,
                    name: "price",
                  },
                  {
                    type: "text",
                    label: `Total (${selectedClient.currency})`,
                    name: "total",
                    readOnly: true,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex-1 mx-2">
                    <label className="block text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </label>
                    <input
                      type={item.type}
                      name={item.name}
                      value={
                        item.name === "total"
                          ? (itemDetails.usage * itemDetails.price).toFixed(2)
                          : itemDetails[item.name]
                      }
                      onChange={
                        item.readOnly
                          ? null
                          : (e) => handleInputChange(e, itemDetails.id)
                      }
                      className={`w-full py-2 px-4 mt-1 rounded border dark:bg-[#1E2139] dark:border-gray-600 dark:text-white ${
                        isValidatorActive &&
                        String(formData[item.name]).trim() === ""
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      readOnly={item.readOnly}
                    />
                  </div>
                ))}
                <button
                  onClick={() => onDelete(itemDetails.id)}
                  className="flex flex-col self-end text-red-500 hover:text-red-700 ml-2"
                >
                  <FaTrash size={16} className="mx-auto mb-1" />
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  items: [
                    ...prev.items,
                    {
                      name: "",
                      quantity: prev.items.length + 1,
                      price: 0,
                      usage: 0,
                      total: 0,
                      id: uuidv4(),
                    },
                  ],
                }))
              }
              className="w-full py-2 rounded bg-gray-200 dark:bg-[#252945] text-center hover:opacity-80"
            >
              + Add New Item
            </button>
          </div>

          {/* Tax Invoice Number & Tax Rate Input */}
          {[
            {
              type: "text",
              label: "Tax Invoice Number",
              name: "taxInvoiceNumber",
              placeholder: "Enter tax invoice number",
            },
            {
              type: "number",
              label: "Tax (%)",
              name: "tax",
              placeholder: "Enter tax percentage (e.g., 11)",
            },
          ].map((item, index) => (
            <div key={index} className="col-span-3">
              <label className="text-gray-400 dark:text-gray-300 block mb-1">
                {item.label}
              </label>
              <input
                type={item.type}
                name={item.name}
                value={formData[item.name]}
                onChange={(e) => handleInputChange(e)}
                placeholder={item.placeholder || ""}
                className={`w-full py-2 px-4 rounded border dark:bg-[#1E2139] dark:text-white ${
                  isValidatorActive && String(formData[item.name]).trim() === ""
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            </div>
          ))}

          {/* Total Section */}
          <div className="text-right mt-6 space-y-2 text-sm">
            {[
              { label: "Subtotal", value: subtotal },
              { label: "Tax", value: taxAmount },
              { label: "Total", value: total },
            ].map((item, index) => (
              <p key={index}>
                <span className="font-bold">{item.label}:</span>{" "}
                {formatCurrency(item.value, selectedClient.currency)}
              </p>
            ))}
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

              // if (!selectedClient) {
              //   alert("Client Empty");
              //   return;
              // }
              if (validator(formData)) onSubmit();
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

export default InvoiceForm;
