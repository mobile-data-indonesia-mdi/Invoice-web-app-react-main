import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FiEye, FiDownload } from "react-icons/fi";
import PaidStatus from "@/components/ui/PaidStatus.jsx";
import VoidModal from "@/components/ui/modal/VoidModal";
import DataTable from "@/components/ui/table/DataTable.jsx";
import SortableHeader from "@/components/ui/table/SortableHeader.jsx";

import { toggleVoidInvoice } from "@/redux/invoiceSlice.js";
import { formatCurrency } from "@/functions/formatCurrency.js";
import useAuth from "@/hooks/useAuth.js";

import {AnimatePresence} from "framer-motion";

// Custom global filter function for filtering across multiple columns
const customGlobalFilterFn = (row, columnId, filterValue) => {
  const searchValue = String(filterValue || "").toLowerCase();

  const status = row.original.voidedAt != null ? "void" : String(row.original.paymentStatus || "").toLowerCase();

  // Gabungkan kolom yang ingin difilter
  const rowValues = [
    String(row.original.invoiceNumber || "").toLowerCase(), // Kolom clientName
    String(row.original.issueDate || "").toLowerCase(), // Kolom invoiceNumber
    String(row.original.taxInvoiceNumber || "").toLowerCase(), // Kolom taxInvoiceNumber
    String(row.original.dueDate || "").toLowerCase(), // Kolom paymentDate
    String(row.original.clientName || "").toLowerCase(), // Kolom paymentAmount
    String(row.original.totalAmount || "").toLowerCase(), // Kolom paymentAmount
    status.toLowerCase(), // Kolom Status
  ];

  // Periksa apakah nilai filter ada di salah satu kolom
  return rowValues.some(value => value.includes(searchValue));
};

export default function InvoiceTable({ setIsEditOpen, from }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  // State Hooks
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidStatus, setVoidStatus] = useState("");
  const [invoiceId, setInvoiceId] = useState(null);

  // Redux Selectors
  const invoices = useSelector((state) => state.invoices.filteredInvoice);
  const clients = useSelector((state) => state.clients.allClients);

  // Fungsi untuk menavigasi ke halaman invoice
  const handleView = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`, {state: {from}});
  };

  // Fungsi untuk mendownload invoice sebagai PDF
  const handleDownload = (invoiceId) => {
    navigate(`/invoices/${invoiceId}?download=true`, {state: {from}});
  };

  // Fungsi untuk handle aksi Void/Unvoid
  const onVoidButtonClick = async (invoiceId) => {
    // Dispatch action untuk update status invoice
    await dispatch(toggleVoidInvoice(invoiceId));
    setIsVoidModalOpen(false); // Tutup modal setelah aksi
  };

  // Data untuk DataTable
  const data = useMemo(() => {
    return invoices.map((invoice, index) => {
      let client = invoice.client;
      if (!client && invoice.client_id && typeof clients !== "undefined") {
        client = clients.find(c => c.client_id === invoice.client_id);
      }

      return {
        invoiceId: invoice.invoice_id,
        invoiceNumber: invoice.invoice_number || "N/A",
        taxInvoiceNumber: invoice.tax_invoice_number || "N/A",
        issueDate: invoice.issue_date?.split("T")[0] || "N/A",
        dueDate: invoice.due_date?.split("T")[0] || "N/A",
        clientName: client?.client_name || "N/A",
        totalAmount: invoice.total || 0,
        paymentStatus: invoice.payment_status || "unpaid",
        currency: client?.currency || "USD",
        voidedAt: invoice.voided_at,
      };
    });
  }, [invoices, clients]);

  // Define columns for the DataTable
  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: "index",
        header: 'No.',
        size: '1%',
        cell: ({ row }) => (`${row.index + 1}.`),
        headerClassName: 'w-1 text-center col-span-1 px-4',
        cellClassName: 'w-1 text-center col-span-1 px-4',
      },
      {
        accessorKey: 'invoiceNumber',
        header: ({ column }) => SortableHeader("Invoice Number", column),
        cell: ({ row }) => (
          <div onClick={() => handleView(row.original.invoiceId)} className="w-full cursor-pointer hover:underline hover:text-blue-500">
            <span>{row.getValue('invoiceNumber')}</span>
          </div>
        ),
        enableSorting: true,
        enableGlobalFilter: true,
        headerClassName: 'w-1/9 text-center',
        cellClassName: 'w-1/9 text-center',
      },
      {
        accessorKey: 'taxInvoiceNumber',
        header: ({ column }) => SortableHeader('Tax Invoice Number', column),
        cell: ({ row }) => (
            row.getValue('taxInvoiceNumber')
        ),
        enableSorting: true,
        enableGlobalFilter: true,
        headerClassName: 'w-1/9 text-center',
        cellClassName: 'w-1/9 text-center',
      },
      {
        accessorKey: 'issueDate',
        header: ({ column }) => SortableHeader("Invoice Date", column),
        cell: ({ row }) => (
          row.getValue('issueDate')
        ),
        enableSorting: true,
        enableGlobalFilter: true,
        headerClassName: 'w-1/9 text-center px-4',
        cellClassName: 'w-1/9 text-center px-4',
      },
      {
        accessorKey: 'dueDate',
        header: ({ column }) => SortableHeader("Due Date", column),
        cell: ({ row }) => (
          row.getValue('dueDate')
        ),
        enableSorting: true,
        enableGlobalFilter: true,
        headerClassName: 'w-1/9 text-center px-4',
        cellClassName: 'w-1/9 text-center px-4',
      },
      {
        accessorKey: 'clientName',
        header: ({ column }) => SortableHeader("Client Name", column),
        cell: ({ row}) => (row.getValue('clientName')),
        enableSorting: true,
        enableGlobalFilter: true,
        headerClassName: 'w-1/9 text-center px-2',
        cellClassName: 'w-1/9 text-center px-2',
      },
      {
        accessorKey: 'totalAmount',
        header: ({ column }) => SortableHeader("Total", column, "right"),
        cell: ({ row }) => (
          formatCurrency(
            row.getValue('totalAmount'),
            row.original.currency
          )
        ),
        enableSorting: true,
        enableGlobalFilter: true,
        headerClassName: 'w-1/9 text-right',
        cellClassName: 'w-1/9 text-right',
      },
      {
        accessorKey: 'paymentStatus',
        header: ({ column }) => SortableHeader("Status", column),
        cell: ({ row }) => (
          <PaidStatus type={row.original.voidedAt != null ? 'void' : row.getValue('paymentStatus')} />
        ),
        enableSorting: true,
        enableGlobalFilter: true,
        headerClassName: 'w-1/9 text-center px-4',
        cellClassName: 'w-1/9 text-center px-4',
      },
      {
        id: "action",
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => handleView(row.original.invoiceId)}
              className="p-2 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
              title="View"
            >
              <FiEye size={16} />
            </button>

            <button
              onClick={() => handleDownload(row.original.invoiceId)}
              className="p-2 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
              title="Download PDF"
            >
              <FiDownload size={16} />
            </button>
          </div>
        ),
        headerClassName: 'w-1/9 text-center px-4',
        cellClassName: 'w-1/9 text-center px-4',
      },
    ];

    if (auth.user.role === "finance") {
      baseColumns.push({
        id: 'void',
        header: 'Void',
        cell: ({ row }) => (
          <button
            onClick={() => {
              setInvoiceId(row.original.invoiceId);
              setVoidStatus(row.original.voidedAt != null ? 'unvoid' : 'void');
              setIsVoidModalOpen(true);
            }}
            className={`px-4 py-1 text-sm rounded-full shadow-md text-white transition-all duration-150 ${
              row.original.voidedAt != null
                ? 'bg-gray-500 hover:bg-gray-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {row.original.voidedAt != null ? 'Unvoid' : 'Void'}
          </button>
        ),
        headerClassName: 'w-1/9 text-center px-2',
        cellClassName: 'w-1/9 text-center px-2',
      });
    }

    return baseColumns;
  }, [auth.user.role]);

  return(
    <>
      <DataTable
        columns={columns}
        data={data}
        customGlobalFilterFn={customGlobalFilterFn}
      />

      <AnimatePresence>
        {isVoidModalOpen && (
          <VoidModal
            itemToVoid={"invoice"}
            status={voidStatus}
            onVoidButtonClick={() => onVoidButtonClick(invoiceId)}
            setIsVoidModalOpen={setIsVoidModalOpen}
          />
        )}
      </AnimatePresence>
    </>
  )
}