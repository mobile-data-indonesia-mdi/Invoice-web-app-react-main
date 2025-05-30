import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import ExpandableReportTable from "@/components/ui/table/ExpandableReportTable.jsx";
import SortableHeader from "@/components/ui/table/SortableHeader.jsx";
import ReportDetailTable from "./ReportDetailTable.jsx";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

import { formatCurrency } from "@/functions/formatCurrency.js";

const customGlobalFilterFn = (row, columnId, filterValue) => {
	const searchValue = String(filterValue || "").toLowerCase();

	// Gabungkan kolom yang ingin difilter
	const rowValues = [
		String(row.original.clientName || "").toLowerCase(), // Kolom clientName
        String(row.original.total || "").toLowerCase(), // Kolom total
	];

	// Periksa apakah nilai filter ada di salah satu kolom
	return rowValues.some(value => value.includes(searchValue));
};

export default function ReportTable({ from }) {
    const invoices = useSelector((state) => state.invoices.allInvoices) || [];
    const clients = useSelector((state) => state.clients.allClients || []);

    const data = useMemo(() => {
        // Group invoice by client name
        const grouped = {};
        invoices.forEach((invoice) => {
            const clientName = invoice.client?.client_name || "Unknown Client";
            if (!grouped[clientName]) {
                grouped[clientName] = [];
            }
            grouped[clientName].push(invoice);
        });

        // Gabungkan dengan semua client
        return clients.map((client) => {
            const clientName = client.client_name;
            const clientInvoices = grouped[clientName] || [];
            const total = clientInvoices.reduce((sum, inv) => {
                if ((inv.payment_status === "unpaid" || inv.payment_status === "partial") && inv.voided_at === null) {
                    const amountDue = inv.total - inv.amount_paid;
                    return sum + (amountDue > 0 ? amountDue : 0);
                }
                return sum;
            }, 0);

            return {
                clientName: clientName || "Unknown Client",
                total: formatCurrency(total, client.currency || "IDR"),
                clientInvoices,
            };
        });
    });

    const columns = useMemo(() => [
        {
            id: 'expander',
            header: '',
            size: '1%',
            cell: ({ row }) => {
                if (!row.getCanExpand()) return null;
                const handleClick = (e) => {
                    e.stopPropagation();
                    row.toggleExpanded();
                };
                return row.getIsExpanded() ? (
                    <FaMinusCircle
                        className="cursor-pointer"
                        onClick={handleClick}
                        title="Collapse"
                    />
                ) : (
                    <FaPlusCircle
                        className="cursor-pointer"
                        onClick={handleClick}
                        title="Expand"
                    />
                );
            },
            headerClassName: 'w-1 text-center col-span-1',
            cellClassName: 'w-1 text-center col-span-1',
        },
        {
            accessorKey: 'clientName',
            header: ({ column }) => SortableHeader('Client Name', column, 'left'),
            cell: ({ row }) => row.getValue('clientName'),
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'text-left',
            cellClassName: 'text-left',
        },
        {
            accessorKey: 'total',
            header: ({ column }) => SortableHeader('Total', column, 'right'),
            cell: ({ row }) => row.getValue('total'),
            enableSorting: true,
            enableGlobalFilter: true,
            headerClassName: 'text-right',
            cellClassName: 'text-right',
        },
    ], []);

    return (
        <ExpandableReportTable
            data={data}
            columns={columns}
            customGlobalFilterFn={customGlobalFilterFn}
            renderSubComponent={(row) => <ReportDetailTable invoices={row.original.clientInvoices} from={from} />}
            getRowCanExpand={() => true}
        />
            
    );
}