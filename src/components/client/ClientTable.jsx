import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {AnimatePresence} from "framer-motion";

import {FaEdit} from "react-icons/fa";
import DataTable from "@/components/ui/table/DataTable.jsx";
import SortableHeader from "@/components/ui/table/SortableHeader.jsx";

import { fetchClientById } from "@/redux/clientSlice";
import useAuth from "@/hooks/useAuth.js";

// Custom global filter function for filtering across multiple columns
const customGlobalFilterFn = (row, columnId, filterValue) => {
	const searchValue = String(filterValue || "").toLowerCase();

	// Gabungkan kolom yang ingin difilter
	const rowValues = [
		String(row.original.clientName || "").toLowerCase(), // Kolom clientName
        String(row.original.currency || "").toLowerCase(), // Kolom currency
        String(row.original.country || "").toLowerCase(), // Kolom country
        String(row.original.clientAddress || "").toLowerCase(), // Kolom clientAddress
        String(row.original.postalCode || "").toLowerCase(), // Kolom postalCode
        String(row.original.clientPhone || "").toLowerCase(), // Kolom clientPhone
	];

	// Periksa apakah nilai filter ada di salah satu kolom
	return rowValues.some(value => value.includes(searchValue));
};

export default function ClientTable({setShowModal}) {
	const dispatch = useDispatch();
	const auth = useAuth();

	// Redux Selectors
	const clients = useSelector((state) => state.clients.allClients);

	const handleEdit = async (clientId) => {
		await dispatch(fetchClientById(clientId));
		setShowModal({type: "edit", status: true});
	};

	const data = useMemo(() => {
		return clients.map((client, index) => ({
			clientId: client.client_id,
			clientName: client.client_name,
			currency: client.currency,
			country: client.country,
			clientAddress: client.client_address,
			postalCode: client.postal_code,
			clientPhone: client.client_phone,
		}));
	});

	const columns = useMemo(() => {
		if (!auth.user.role) return [];
		const baseColumns = [
			{
				id: 'index',
				header: 'No.',
				cell: ({ row }) => (`${row.index + 1}.`),
				enableSorting: false
			},
			{
				accessorKey: 'clientName',
				header: ({ column }) => SortableHeader("Client Name", column),
				cell: ({ row }) => (row.getValue('clientName') || 'N/A'),
				enableSorting: true,
				enableGlobalFilter: true,
			},
			{
				accessorKey: 'currency',
				header: ({ column }) => SortableHeader("Currency", column),
				cell: ({ row }) => (row.getValue('currency') || 'USD'),
				enableSorting: true,
				enableGlobalFilter: true,            
			},
			{
				accessorKey: 'country',
				header: ({ column }) => SortableHeader("Country", column),
				cell: ({ row }) => (row.getValue('country') || 'N/A'),
				enableSorting: true,
				enableGlobalFilter: true,            
			},
			{
				accessorKey: 'clientAddress',
				header: ({ column }) => SortableHeader("Address", column),
				cell: ({ row }) => (row.getValue('clientAddress') || 'N/A'),
				enableSorting: true,
				enableGlobalFilter: true,            
			},
			{
				accessorKey: 'postalCode',
				header: ({ column }) => SortableHeader("Postal Code", column),
				cell: ({ row }) => (row.getValue('postalCode') || 'N/A'),
				enableSorting: true,
				enableGlobalFilter: true,            
			},
			{
				accessorKey: 'clientPhone',
				header: ({ column }) => SortableHeader("Phone", column),
				cell: ({ row }) => (row.getValue('clientPhone') || 'N/A'),
				enableSorting: true,
				enableGlobalFilter: true,
			},
			
		];

		console.log("Auth User Role:", auth.user.role);
		if (auth.user.role === "finance") {
			baseColumns.push({
				id: 'action',
				header: 'Action',
				cell: ({ row }) => (
					<button
						onClick={() => handleEdit(row.original.clientId)}
						className="p-2 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900"
						title="Edit"
					>
						<FaEdit size={16} />
					</button>
				),
			});
		}

		return baseColumns;
	}, [auth.user.role]);

	return (
		<DataTable
			data={data}
			columns={columns}
			customGlobalFilterFn={customGlobalFilterFn}
		/>
	);
};