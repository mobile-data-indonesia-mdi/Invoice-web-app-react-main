import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {AnimatePresence} from "framer-motion";

import {FaEdit, FaLink} from "react-icons/fa";
import VoidModal from "@/components/ui/modal/VoidModal";
import DataTable from "@/components/ui/table/DataTable.jsx";
import SortableHeader from "@/components/ui/table/SortableHeader.jsx";
import PaidStatus from "@/components/ui/PaidStatus.jsx";

import { toggleVoidPayment, fetchPaymentById } from "@/redux/paymentSlice.js";
import { getProofOfTransferApi } from "@/api/paymentApi.js";
import { formatCurrency } from "@/functions/formatCurrency.js";
import useAuth from "@/hooks/useAuth.js";

// Custom global filter function for filtering across multiple columns
const customGlobalFilterFn = (row, columnId, filterValue) => {
	const searchValue = String(filterValue || "").toLowerCase();

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
		String(row.original.clientName || "").toLowerCase(), // Kolom clientName
		String(row.original.invoiceNumber || "").toLowerCase(), // Kolom invoiceNumber
		String(row.original.paymentDate || "").toLowerCase(), // Kolom paymentDate
		String(row.original.paymentAmount || "").toLowerCase(), // Kolom paymentAmount
		voidStatus.toLowerCase(), // Kolom Status
	];

	// Periksa apakah nilai filter ada di salah satu kolom
	return rowValues.some(value => value.includes(searchValue));
};

export default function PaymentTable({setIsEditOpen, from}) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const auth = useAuth();

	// State Hooks
	const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
	const [voidStatus, setVoidStatus] = useState('');
	const [paymentId, setPaymentId] = useState(null);

	// Redux Selectors
	const payments = useSelector((state) => state.payments.filteredPayment);

	// Fungsi untuk menavigasi ke halaman invoice
	const handleView = (invoiceId) => {
		navigate(`/invoices/${invoiceId}`, { state: { from } });
	};

	const handleEdit = async (paymentId) => {
		await dispatch(fetchPaymentById(paymentId));
		setIsEditOpen(true);
	};


	// Go to see file proof of transfer
	const onLinkClick = (proofOfTransfer) => {
		const fileUrl = proofOfTransfer
		const uploadPathStartIndex = fileUrl.indexOf("upload");
		const relativeFilePath = fileUrl.substring(uploadPathStartIndex);
		getProofOfTransferApi(relativeFilePath);
	};

	// Fungsi untuk handle aksi Void/Unvoid
	const onVoidButtonClick = async (paymentId) => {
		await dispatch(toggleVoidPayment(paymentId));
		setIsVoidModalOpen(false); // Tutup modal setelah aksi
	};

	const data = useMemo(() => payments.map((payment) => {
		const { invoice: invoice } = payment;
		const { client: client } = invoice ? invoice : {};

		return {
			paymentId: payment.payment_id,
			invoiceNumber: invoice.invoice_number || 'N/A',
			clientName: client.client_name || 'N/A',
			paymentDate: payment.payment_date.split('T')[0] || 'N/A',
			paymentAmount: payment.amount_paid || 0,
			currency: client.currency || 'USD',
			proofOfTransfer: payment.proof_of_transfer || '#',
			voidedAt: payment.voided_at	|| null,
			invoiceId: invoice.invoice_id,
		};
	}));

	const columns = useMemo(() => {
		const baseColumns = [
			{
				id: 'index',
				header: 'No.',
				cell: ({ row }) => (`${row.index + 1}.`),
			},
			{
				accessorKey: 'clientName',
				header: ({ column }) => SortableHeader("Client Name", column),
				cell: ({ row }) => (row.getValue('clientName')),
				enableSorting: true,
				enableGlobalFilter: true,
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
			},
			{
				accessorKey: 'paymentDate',
				header: ({ column }) => SortableHeader("Payment Date", column),
				cell: ({ row }) => (
						row.getValue('paymentDate')
				),
				enableSorting: true,
				enableGlobalFilter: true,
			},
			{
				accessorKey: 'paymentAmount',
				header: ({ column }) => SortableHeader("Payment Amount", column),
				cell: ({ row }) => (
						formatCurrency(
								row.getValue('paymentAmount'),
								row.original.currency
						)
				),
				enableSorting: true,
				enableGlobalFilter: true,
			},
			{
				accessorKey: 'voidedAt',
				header: ({ column }) => SortableHeader("Void Status", column),
				cell: ({ row }) => (
					<PaidStatus type={row.original.voidedAt != null ? 'void' : 'not-void'} />
				),
				enableSorting: true,
				enableGlobalFilter: true,
			},
			{
				accessorKey: 'proofOfTransfer',
				header: 'Proof of Transfer',
				cell: ({ row }) => (
						<button
								onClick={() => onLinkClick(row.original.proofOfTransfer)}
								className="p-2 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
								title="View Proof of Transfer"
						>
							<FaLink size={16} />
						</button>
				),
			},
		];

		if (auth.user.role === "finance") {
			baseColumns.push(
				{
					id: 'action',
					header: 'Action',
					cell: ({ row }) => (
							<button
									onClick={() => handleEdit(row.original.paymentId)}
									className="p-2 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900"
									title="Edit"
							>
								<FaEdit size={16} />
							</button>
					),
				},
				{
					id: 'void',
					header: 'Void',
					cell: ({ row }) => (
							<button
									onClick={() => {
										setPaymentId(row.original.paymentId);
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
				}
			);
		}
		return baseColumns;
	});

	return (
		<>
			<DataTable
				data={data}
				columns={columns}
				customGlobalFilterFn={customGlobalFilterFn}
			/>

			{/* Modal */}
			<AnimatePresence>
				{isVoidModalOpen && (
					<VoidModal
						itemToVoid={"payment"}
						status={voidStatus}
						onVoidButtonClick={() => onVoidButtonClick(paymentId)}
						setIsVoidModalOpen={setIsVoidModalOpen}
					/>
				)}
			</AnimatePresence>
		</>
	)
};