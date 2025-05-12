'use client';

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
	Input,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from '@heroui/react';
import DeleteUpdateMedicationStatus from '../forms/delete-update-medication-status';
import Link from 'next/link';
import { useState, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { SearchIcon, ChevronDown } from 'lucide-react';

// Definimos columnas con uid y nombre
const columns = [
	{ name: 'Name', uid: 'name' },
	{ name: 'Category', uid: 'category' },
	{ name: 'Quantity', uid: 'quantity' },
	{ name: 'Min Stock', uid: 'minStock' },
	{ name: 'Lot #', uid: 'lotNumber' },
	{ name: 'Expiry', uid: 'expiryDate' },
	{ name: 'Status', uid: 'status' },
	{ name: 'Actions', uid: 'actions' },
];

// Inicialmente todas las columnas visibles
const INITIAL_VISIBLE_COLUMNS = new Set(columns.map(col => col.uid));

const MedicationsTable = ({ medications }: { medications: Medication[] }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [selectedMedication, setSelectedMedication] =
		useState<Medication | null>(null);
	const { data: session } = useSession();

	console.log('SESSION:', session);

	// -------------------------------
	// Búsqueda global multicampo
	// -------------------------------
	const [filterValue, setFilterValue] = useState('');

	const onSearchChange = useCallback((value: string) => {
		setFilterValue(value || '');
	}, []);

	const onClear = useCallback(() => {
		setFilterValue('');
	}, []);

	// -------------------------------
	// Filtro por status
	// -------------------------------
	const uniqueStatuses = Array.from(
		new Set(medications.map(med => med.status))
	);
	const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());

	// -------------------------------
	// Visibilidad de columnas
	// -------------------------------
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		INITIAL_VISIBLE_COLUMNS
	);

	// -------------------------------
	// Filtrado final
	// -------------------------------
	const filteredMedications = useMemo(() => {
		let filtered = medications;

		// Filtro por búsqueda
		if (filterValue) {
			const searchTerm = filterValue.toLowerCase();
			filtered = filtered.filter(
				med =>
					med.name.toLowerCase().includes(searchTerm) ||
					med.category.toLowerCase().includes(searchTerm) ||
					med.lotNumber.toLowerCase().includes(searchTerm)
			);
		}

		// Filtro por status
		if (statusFilter.size > 0) {
			filtered = filtered.filter(med => statusFilter.has(med.status));
		}

		return filtered;
	}, [medications, filterValue, statusFilter]);

	// -------------------------------
	// Renderizado de celdas dinámico
	// -------------------------------
	const renderCell = (med: Medication, columnKey: string) => {
		switch (columnKey) {
			case 'name':
				return med.name;
			case 'category':
				return med.category;
			case 'quantity':
				return med.quantity;
			case 'minStock':
				return med.minStock;
			case 'lotNumber':
				return med.lotNumber;
			case 'expiryDate':
				return new Date(med.expiryDate).toLocaleDateString();
			case 'status':
				return med.status;
			case 'actions':
				return (
					<div className='flex gap-2'>
						<Button color='primary' size='sm'>
							<Link href={`/dashboard/medications/${med.id}`}>Update</Link>
						</Button>
						<Button
							isDisabled={med.status === 'REMOVED'}
							color='danger'
							size='sm'
							onPress={() => {
								setSelectedMedication(med);
								onOpen();
							}}>
							Delete
						</Button>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<>
			{/* Buscador y Filtros */}
			<div className='mb-4 flex flex-col sm:flex-row gap-3 justify-between items-end'>
				<Input
					isClearable
					className='w-full sm:max-w-[40%]'
					placeholder='Search by name, category or lot number...'
					startContent={<SearchIcon />}
					value={filterValue}
					onClear={onClear}
					onValueChange={onSearchChange}
				/>

				<div className='flex gap-2'>
					{/* Filtro por Status */}
					<Dropdown>
						<DropdownTrigger>
							<Button variant='flat' endContent={<ChevronDown size={16} />}>
								Filter by Status
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							closeOnSelect={false}
							selectionMode='multiple'
							selectedKeys={statusFilter}
							onSelectionChange={keys =>
								setStatusFilter(new Set(Array.from(keys, String)))
							}>
							{uniqueStatuses.map(status => (
								<DropdownItem key={status}>{status}</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>

					{/* Visibilidad de columnas */}
					<Dropdown>
						<DropdownTrigger>
							<Button variant='flat' endContent={<ChevronDown size={16} />}>
								Columns
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							closeOnSelect={false}
							selectionMode='multiple'
							selectedKeys={visibleColumns}
							onSelectionChange={keys =>
								setVisibleColumns(new Set(Array.from(keys, String)))
							}>
							{columns.map(column => (
								<DropdownItem key={column.uid}>{column.name}</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			<Table aria-label='Medications table'>
				<TableHeader>
					{columns
						.filter(column => visibleColumns.has(column.uid))
						.map(column => (
							<TableColumn key={column.uid}>{column.name}</TableColumn>
						))}
				</TableHeader>
				<TableBody
					emptyContent='No medications found'
					items={filteredMedications}>
					{filteredMedications.map(med => (
						<TableRow key={med.id}>
							{columns
								.filter(column => visibleColumns.has(column.uid))
								.map(column => (
									<TableCell key={column.uid}>
										{renderCell(med, column.uid)}
									</TableCell>
								))}
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Modal de Eliminación */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader className='flex flex-col gap-1'>
								Delete Medication {selectedMedication?.name}
							</ModalHeader>
							<ModalBody>
								{session?.user.role !== 'ADMIN' && (
									<p className='text-red-500'>
										This action is restricted to admins only.
									</p>
								)}
								<p>
									This is a soft delete action. The medication will still be in
									the database but marked as removed. Are you sure you want to
									delete this medication?
								</p>
								{selectedMedication && (
									<DeleteUpdateMedicationStatus
										medicationId={selectedMedication.id}
										onClose={onClose}
									/>
								)}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default MedicationsTable;
