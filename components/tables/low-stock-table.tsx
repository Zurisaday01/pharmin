'use client';

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from '@heroui/react';

export function LowStockTable({ data }: { data: Medication[] }) {
	if (data.length === 0) {
		return (
			<p className='text-sm text-gray-500'>
				All medications are above their minimum stock.
			</p>
		);
	}

	return (
		<Table aria-label='Low stock medications table' className='border-none shadow-none h-full'>
			<TableHeader>
				<TableColumn>Name</TableColumn>
				<TableColumn>Qty</TableColumn>
				<TableColumn>Min</TableColumn>
				<TableColumn>Expiry</TableColumn>
			</TableHeader>
			<TableBody>
				{data.map(med => (
					<TableRow key={med.id}>
						<TableCell>{med.name}</TableCell>
						<TableCell>{med.quantity}</TableCell>
						<TableCell>{med.minStock}</TableCell>
						<TableCell>
							{med.expiryDate
								? new Date(med.expiryDate).toISOString().split('T')[0]
								: '—'}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
