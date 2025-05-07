'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Form, Input, Button, Select, SelectItem } from '@heroui/react';
import { Loader2 } from 'lucide-react';

import { updateUser } from '@/lib/actions/user.actions';
import { USER_ROLES } from '@/lib/constants';


interface InitialStateType {
	success: boolean;
	message: string;
}

const initialState: InitialStateType = {
	success: false,
	message: '',
};

function handleUserUpdate(_: InitialStateType, formData: FormData) {
	return updateUser(formData);
}

const UpdateUserForm = ({
	user,
}: {
	user: { id: string; email: string; name: string; role: string };
}) => {
	const [data, action, isPending] = useActionState(
		handleUserUpdate,
		initialState
	);
	const { pending } = useFormStatus();
	const router = useRouter();

	useEffect(() => {
		if (data?.success) {
			router.push('/dashboard/users');
		}
	}, [data, router]);

	return (
		<Form action={action} className='w-full flex flex-col gap-6'>
			<input type='hidden' name='id' value={user.id} />

			<div className='flex items-center justify-between w-full gap-4'>
				<Input
					name='email'
					label='Email'
					labelPlacement='outside'
					defaultValue={user.email}
					isReadOnly
					disabled
				/>
				<Input
					name='name'
					label='Name'
					labelPlacement='outside'
					defaultValue={user.name}
					placeholder='Enter full name'
					isRequired
					disabled={pending || isPending}
				/>
			</div>

			<Select
				name='role'
				label='Role'
				labelPlacement='outside'
				defaultSelectedKeys={[user.role]}
				placeholder='Select role'
				isRequired
				disabled={pending || isPending}>
				{USER_ROLES.map(role => (
					<SelectItem key={role}>
						{role}
					</SelectItem>
				))}
			</Select>

			<Button type='submit' disabled={pending || isPending} color='primary'>
				{pending || isPending ? (
					<Loader2 className='animate-spin w-5 h-5 text-white' />
				) : (
					'Update User'
				)}
			</Button>

			{data && !data.success && (
				<div className='text-center text-destructive'>{data.message}</div>
			)}
		</Form>
	);
};

export default UpdateUserForm;
