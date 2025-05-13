'use client';

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from '@heroui/react';
import { Chip } from '@heroui/react';

const InventoryMovementTable = ({
	movements,
}: {
	movements: InventoryMovement[];
}) => {
	return (
		<Table aria-label='Users table'>
			<TableHeader>
				<TableColumn>Product Name</TableColumn>
				<TableColumn>Description</TableColumn>
				<TableColumn>Movement Type</TableColumn>
				<TableColumn>Created At</TableColumn>
				<TableColumn>Created By</TableColumn>
			</TableHeader>
			<TableBody>
				{movements.map(movement => (
					<TableRow key={movement.id}>
						<TableCell>{movement.product.name}</TableCell>
						<TableCell>{movement.description}</TableCell>
						<TableCell>
							{movement.movementType === 'ADDITION' ? (
								<Chip color='success'>Addition</Chip>
							) : movement.movementType === 'REMOVAL' ? (
								<Chip color='danger'>Removal</Chip>
							) : movement.movementType === 'UPDATE' ? (
								<Chip color='warning'>Update</Chip>
							) : (
								<Chip color='secondary'>Consumption</Chip>
							)}
						</TableCell>
						<TableCell>
							{new Date(movement.createdAt).toLocaleString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: true,
							})}
						</TableCell>
						<TableCell>{movement.createdBy}</TableCell>
						{/* <TableCell>
							<Button color='primary' className='mr-2'>
								<Link href={`/dashboard/users/${user.id}`}>Update</Link>
							</Button>
						</TableCell> */}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default InventoryMovementTable;
