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
} from '@heroui/react';
import DeleteUpdateMedicationStatus from '../forms/delete-update-medication-status';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const MedicationsTable = ({ medications }: { medications: Medication[] }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [selectedMedication, setSelectedMedication] =
		useState<Medication | null>(null);

	const { data: session } = useSession();

	return (
		<>
			<Table aria-label='Medications table'>
				<TableHeader>
					<TableColumn>Name</TableColumn>
					<TableColumn>Category</TableColumn>
					<TableColumn>Quantity</TableColumn>
					<TableColumn>Min Stock</TableColumn>
					<TableColumn>Lot #</TableColumn>
					<TableColumn>Expiry</TableColumn>
					<TableColumn>Status</TableColumn>
					<TableColumn>Actions</TableColumn>
				</TableHeader>
				<TableBody>
					{medications.map(med => (
						<TableRow key={med.id}>
							<TableCell>{med.name}</TableCell>
							<TableCell>{med.category}</TableCell>
							<TableCell>{med.quantity}</TableCell>
							<TableCell>{med.minStock}</TableCell>
							<TableCell>{med.lotNumber}</TableCell>
							<TableCell>
								{new Date(med.expiryDate).toLocaleDateString()}
							</TableCell>
							<TableCell>{med.status}</TableCell>
							<TableCell>
								{/* Add action buttons here */}
								<Button color='primary' className='mr-2'>
									<Link href={`/dashboard/medications/${med.id}`}>Update</Link>
								</Button>

								<Button
									isDisabled={med.status === 'REMOVED'}
									color='danger'
									onPress={() => {
										setSelectedMedication(med);
										onOpen();
									}}>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
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
