import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DataTable from "@/components/ui/table/DataTable.jsx";
import SortableHeader from "@/components/ui/table/SortableHeader.jsx";
import PaidStatus from "@/components/ui/PaidStatus.jsx";

import { formatCurrency } from "@/functions/formatCurrency.js";

// Custom global filter function for filtering across multiple columns
const customGlobalFilterFn = (row, columnId, filterValue) => {
  const searchValue = String(filterValue || "").toLowerCase();
  
  const paymentStatus = row.original.paymentStatus !== "paid" ? "Outstanding" : "Cleared";
  const voidStatus = row.original.voidedAt != null ? "void" : "not-void";

  // If searching for void status specifically, use exact match
  if (
    searchValue === "void" ||
    searchValue === "not-void"
  ) {
    return voidStatus === searchValue;
  }

  // Gabungkan kolom yang ingin difilter
  const rowValues = [
    String(row.original.invoiceNumber || "").toLowerCase(), // Kolom invoiceNumber
    String(row.original.taxInvoiceNumber || "").toLowerCase(), // Kolom taxInvoiceNumber
    String(row.original.issueDate || "").toLowerCase(), // Kolom issueDate
    String(row.original.dueDate || "").toLowerCase(), // Kolom dueDate
    String(row.original.totalAmount || "").toLowerCase(), // Kolom totalAmount
    String(row.original.remainingPayment || "").toLowerCase(), // Kolom remainingPayment
    String(row.original.paymentStatus || "").toLowerCase(), // Kolom paymentStatus
    paymentStatus.toLowerCase(), // Kolom paymentStatus
    voidStatus.toLowerCase(), // Kolom voidStatus
  ];

  // Periksa apakah nilai filter ada di salah satu kolom
  return rowValues.some(value => value.includes(searchValue));
};

export default function ReportDetailTable({ invoices, from }) {
    const navigate = useNavigate();

    // Fungsi untuk menavigasi ke halaman invoice
	const handleView = (invoiceId) => {
		navigate(`/invoices/${invoiceId}`, { state: { from } });
	};

    // Data untuk DataTable
    const data = useMemo(() => {
        return invoices.map((invoice, index) => ({
            invoiceId: invoice.invoice_id,
            invoiceNumber: invoice.invoice_number || "N/A",
            taxInvoiceNumber: invoice.tax_invoice_number || "N/A",
            issueDate: invoice.issue_date.split("T")[0] || "N/A",
            dueDate: invoice.due_date.split("T")[0] || "N/A",
            totalAmount: invoice.total || 0,
            remainingPayment: invoice.total - invoice.amount_paid || 0,
            paymentStatus: invoice.payment_status || "unpaid",
            currency: invoice.client?.currency || "USD",
            voidedAt: invoice.voided_at,
        }));
    });

    const columns = useMemo(() => [
        {
            id: 'index',
            header: 'No.',
            size: '1%',
            cell: ({ row }) => (`${row.index + 1}.`),
            headerClassName: 'w-1 text-center col-span-1',
            cellClassName: 'w-1 text-center col-span-1',
        },
        {
            accessorKey: 'invoiceNumber',
            header: ({ column }) => SortableHeader('Invoice Number', column),
            cell: ({ row }) => (
                <div onClick={() => handleView(row.original.invoiceId)} className="w-full cursor-pointer hover:underline hover:text-blue-500">
                    <span>{row.getValue('invoiceNumber')}</span>
                </div>
            ),
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'w-1/8 text-center',
            cellClassName: 'w-1/8 text-center',
        },
        {
            accessorKey: 'taxInvoiceNumber',
            header: ({ column }) => SortableHeader('Tax Invoice Number', column),
            cell: ({ row }) => (
               row.getValue('taxInvoiceNumber')
            ),
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'w-1/8 text-center',
            cellClassName: 'w-1/8 text-center',
        },
        {
            accessorKey: 'issueDate',
            header: ({ column }) => SortableHeader("Invoice Date", column),
            cell: ({ row }) => (
                row.getValue('issueDate')
            ),
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'w-1/8 text-center',
            cellClassName: 'w-1/8 text-center',
        },
        {
            accessorKey: 'dueDate',
            header: ({ column }) => SortableHeader("Due Date", column),
            cell: ({ row }) => (
                row.getValue('dueDate')
            ),
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'w-1/8 text-center',
            cellClassName: 'w-1/8 text-center',
        },
        {
            accessorKey: 'totalAmount',
            header: ({ column }) => SortableHeader("Total Amount", column, 'right'),
            cell: ({ row }) => (
                formatCurrency(row.getValue('totalAmount'), row.original.currency)
            ),
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'w-1/6 text-right',
            cellClassName: 'w-1/6 text-right',
        },
        {
            accessorKey: 'remainingPayment',
            header: ({ column }) => SortableHeader("Remaining Payment", column, 'right'),
            cell: ({ row }) => (
                formatCurrency(row.getValue('remainingPayment'), row.original.currency)
            ),
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'w-1/8 text-right',
            cellClassName: 'w-1/8 text-right',
        },
        {
            accessorKey: 'paymentStatus',
            header: ({ column }) => SortableHeader("Payment Status", column),
            cell: ({ row }) => {
                if (row.getValue('paymentStatus') === 'paid') {
                    return <PaidStatus type="Cleared" />
                } else {
                    return <PaidStatus type="Outstanding" />
                }
            },
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'w-1/8 text-center',
            cellClassName: 'w-1/8 text-center',
        },
        {
            accessorKey: 'voidedAt',
            header: 'Void Status',
            cell: ({ row }) => {
                if (row.getValue('voidedAt') === null) {
                    return <PaidStatus type="Not-Void" />;
                } else {
                    return <PaidStatus type="Void" />;
                }
            },
            enableSorting: true,
			enableGlobalFilter: true,
            headerClassName: 'w-1/8 text-center',
            cellClassName: 'w-1/8 text-center',
        }
    ]);

    return (
        <DataTable
            data={data}
            columns={columns}
            customGlobalFilterFn={customGlobalFilterFn}
            selectedMenu={"report"}
        />
    )
}