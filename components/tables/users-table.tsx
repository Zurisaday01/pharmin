'use client';

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
} from '@heroui/react';
import Link from 'next/link';
import { useState } from 'react';

const UsersTable = ({ users }: { users: User[] }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	return (
		<>
			<Table aria-label='Users table'>
				<TableHeader>
					<TableColumn>Name</TableColumn>
					<TableColumn>Email</TableColumn>
					<TableColumn>Role</TableColumn>
					<TableColumn>Created At</TableColumn>
					<TableColumn>Actions</TableColumn>
				</TableHeader>
				<TableBody>
					{users.map(user => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>
								{new Date(user.createdAt).toLocaleDateString()}
							</TableCell>
							<TableCell>
								<Button color='primary' className='mr-2'>
									<Link href={`/dashboard/users/${user.id}`}>Update</Link>
								</Button>
								<Button
									color='danger'
									onPress={() => {
										setSelectedUser(user);
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
							<ModalHeader>Delete User {selectedUser?.name}</ModalHeader>
							<ModalBody>
								<p>
									This will permanently remove the user from the system. Are you
									sure?
								</p>
								{/* TODO: Implement DeleteUserAction component or API call here */}
								<div className='flex justify-end mt-4'>
									<Button onPress={onClose} className='mr-2'>
										Cancel
									</Button>
									<Button
										color='danger'
										onPress={() => {
											// call delete API
											onClose();
										}}>
										Confirm
									</Button>
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UsersTable;
