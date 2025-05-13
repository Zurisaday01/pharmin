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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const UsersTable = ({ users }: { users: User[] }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const router = useRouter();

	const handleDeleteUser = async (userId: string, onClose: () => void) => {
		try {
			const res = await fetch('/api/users/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: userId }),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				toast.success('User deleted successfully');
				onClose();
				router.refresh();
			} else {
				toast.error(data.message || 'Failed to delete user');
			}
		} catch (error) {
			console.error(error);
			alert('Something went wrong');
		}
	};

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
											if (!selectedUser) return;
											handleDeleteUser(selectedUser.id, onClose);
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
