import React, {useState} from 'react';
import { flexRender, useReactTable } from '@tanstack/react-table';
import {AnimatePresence, motion} from "framer-motion";

import {
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from '@tanstack/react-table';

import { 
	Table, 
	TableHeader, 
	TableHead, 
	TableRow,
	TableBody,
	TableCell,
} from '@/components/ui/shadcn/table.jsx';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/pagination.jsx";

// Buat komponen untuk animasi
const MotionTr = motion(TableRow);

export default function DataTable({ data, columns, customGlobalFilterFn, selectedMenu }) {
	const [paginationState, setPaginationState] = useState({
		pageIndex: 0,
		pageSize: selectedMenu === "report" ? 10 : 25,
	});
	const [sortingState, setSortingState] = useState([]);
	const [globalFilter, setGlobalFilter] = useState('');

	// DefineTable
	const table = useReactTable({
		data: data,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: customGlobalFilterFn,  // built-in filter function
		state: {
			sorting: sortingState,
			pagination: paginationState,
			globalFilter: globalFilter,
		},
		onPaginationChange: setPaginationState,
		onSortingChange: setSortingState,
		onGlobalFilterChange: setGlobalFilter,
	});

	return (
		<div className={`${selectedMenu !== 'report' ? 'mt-10 ' : ''}`}>
			{/* Search Bar */}
			<div className="flex items-center justify-start mb-4">
				<input
					value={globalFilter}
					onChange={e => table.setGlobalFilter(String(e.target.value))}
					placeholder="Search..."
					className="p-2 border rounded dark:bg-[#1E2139] dark:text-white shadow-md"
				/>
			</div>

			{/* Table */}
			<div className=
				{`${selectedMenu !== 'report' ? 'mt-10' : ''} 
				rounded-lg shadow-md`}>
				<Table className="table-auto w-full bg-white dark:bg-[#1E2139] rounded-lg">
					<TableHeader className="bg-gray-100 dark:bg-[#252945] text-gray-600 dark:text-gray-300">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className={`py-4 ${header.column.columnDef.headerClassName || 'text-center px-4'}`}>
											{header.isPlaceholder ? null : flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<AnimatePresence>
								<MotionTr
									key={row.id}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }}
									exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<TableCell key={cell.id} className={`py-4 ${cell.column.columnDef.cellClassName || 'text-center px-4'}`}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										);
									})}
								</MotionTr>
							</AnimatePresence>
						))}
					</TableBody>
				</Table>

				{/* Pagination */}
				<div className="flex items-center justify-center py-2">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => {
										if (table.getState().pagination.pageIndex > 0) {
											table.setPageIndex(table.getState().pagination.pageIndex - 1);
										}
									}}
									className="text-gray-500 dark:text-gray-300"
								>
									Previous
								</PaginationPrevious>
							</PaginationItem>
							<PaginationItem>
							<span className="px-3 py-1 text-sm">
								Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
							</span>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									onClick={() => {
										if (table.getState().pagination.pageIndex < table.getPageCount() - 1) {
											table.setPageIndex(table.getState().pagination.pageIndex + 1);
										}
									}}
									className="text-gray-500 dark:text-gray-300"
								>
									Next
								</PaginationNext>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
};