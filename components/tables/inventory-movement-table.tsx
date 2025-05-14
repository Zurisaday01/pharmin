'use client';

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Input,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	Chip,
} from '@heroui/react';
import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, SearchIcon } from 'lucide-react';

const columns = [
	{ name: 'Product Name', uid: 'productName' },
	{ name: 'Description', uid: 'description' },
	{ name: 'Movement Type', uid: 'movementType' },
	{ name: 'Created At', uid: 'createdAt' },
	{ name: 'Created By', uid: 'createdBy' },
];

const INITIAL_VISIBLE_COLUMNS = new Set(columns.map(col => col.uid));

const InventoryMovementTable = ({
	movements,
}: {
	movements: InventoryMovement[];
}) => {
	// Búsqueda
	const [filterValue, setFilterValue] = useState('');
	const onSearchChange = useCallback((value: string) => {
		setFilterValue(value || '');
	}, []);
	const onClear = useCallback(() => setFilterValue(''), []);

	// Filtro por tipo de movimiento
	const movementTypes = Array.from(new Set(movements.map(m => m.movementType)));
	const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set());

	// Visibilidad de columnas
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(INITIAL_VISIBLE_COLUMNS);

	// Filtrado de movimientos
	const filteredMovements = useMemo(() => {
		let filtered = movements;

		if (filterValue) {
			const search = filterValue.toLowerCase();
			filtered = filtered.filter(m =>
				m.product.name.toLowerCase().includes(search) ||
				m.description.toLowerCase().includes(search) ||
				m.createdBy.toLowerCase().includes(search)
			);
		}

		if (typeFilter.size > 0) {
			filtered = filtered.filter(m => typeFilter.has(m.movementType));
		}

		return filtered;
	}, [movements, filterValue, typeFilter]);

	// Render dinámico
	const renderCell = (movement: InventoryMovement, columnKey: string) => {
		switch (columnKey) {
			case 'productName':
				return movement.product.name;
			case 'description':
				return movement.description;
			case 'movementType':
				switch (movement.movementType) {
					case 'ADDITION':
						return <Chip color='success'>Addition</Chip>;
					case 'REMOVAL':
						return <Chip color='danger'>Removal</Chip>;
					case 'UPDATE':
						return <Chip color='warning'>Update</Chip>;
					default:
						return <Chip color='secondary'>Consumption</Chip>;
				}
			case 'createdAt':
				return new Date(movement.createdAt).toLocaleString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: true,
				});
			case 'createdBy':
				return movement.createdBy;
			default:
				return null;
		}
	};

	return (
		<>
			{/* Controles */}
			<div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between items-end">
				<Input
					isClearable
					className="w-full sm:max-w-[40%]"
					placeholder="Search by product, description or creator..."
					startContent={<SearchIcon />}
					value={filterValue}
					onClear={onClear}
					onValueChange={onSearchChange}
				/>

				<div className="flex gap-2">
					{/* Filtro por tipo de movimiento */}
					<Dropdown>
						<DropdownTrigger>
							<Button variant="flat" endContent={<ChevronDown size={16} />}>
								Movement Types
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							closeOnSelect={false}
							selectionMode="multiple"
							selectedKeys={typeFilter}
							onSelectionChange={(keys) =>
								setTypeFilter(new Set(Array.from(keys, String)))
							}
						>
							{movementTypes.map((type) => (
								<DropdownItem key={type}>{type}</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>

					{/* Visibilidad de columnas */}
					<Dropdown>
						<DropdownTrigger>
							<Button variant="flat" endContent={<ChevronDown size={16} />}>
								Columns
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							closeOnSelect={false}
							selectionMode="multiple"
							selectedKeys={visibleColumns}
							onSelectionChange={(keys) =>
								setVisibleColumns(new Set(Array.from(keys, String)))
							}
						>
							{columns.map((col) => (
								<DropdownItem key={col.uid}>{col.name}</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			{/* Tabla */}
			<Table aria-label="Inventory Movement Table">
				<TableHeader>
					{columns
						.filter((col) => visibleColumns.has(col.uid))
						.map((col) => (
							<TableColumn key={col.uid}>{col.name}</TableColumn>
						))}
				</TableHeader>
				<TableBody emptyContent="No inventory movements found" items={filteredMovements}>
					{filteredMovements.map((movement) => (
						<TableRow key={movement.id}>
							{columns
								.filter((col) => visibleColumns.has(col.uid))
								.map((col) => (
									<TableCell key={col.uid}>{renderCell(movement, col.uid)}</TableCell>
								))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
};

export default InventoryMovementTable;
