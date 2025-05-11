'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Form, Input, Button, Select, SelectItem } from '@heroui/react';
import { Loader2 } from 'lucide-react';

import {
	createMedication,
	updateMedication,
} from '@/lib/actions/medication.actions';

interface InitialStateType {
	success: boolean;
	message: string;
}

const initialState: InitialStateType = {
	success: false,
	message: '',
};

function handleMedicationAction(_: typeof initialState, formData: FormData) {
	const id = formData.get('id');
	return id ? updateMedication(formData) : createMedication(formData);
}

const statusOptions = [
	{ label: 'Active', value: 'ACTIVE' },
	{ label: 'Expired', value: 'EXPIRED' },
];

const CreateOrUpdateMedicationForm = ({
	medication,
}: {
	medication?: Medication;
}) => {
	const [data, action, isPending] = useActionState(
		handleMedicationAction,
		initialState
	);
	const { pending } = useFormStatus();
	const router = useRouter();

	useEffect(() => {
		if (data?.success) {
			toast.success(data.message || "Medication saved successfully");
			router.push('/dashboard/medications');
		} else if (data?.message) {
			toast.error(data.message);
		}
	}, [data, router]);

	return (
		<Form action={action} className='w-full flex flex-col gap-6'>
			{medication?.id && (
				<input type='hidden' name='id' value={medication.id} />
			)}

			<div className='flex items-center justify-between w-full gap-4'>
				<Input
					name='name'
					label='Medication Name'
					labelPlacement='outside'
					disabled={pending || isPending}
					placeholder='e.g. Paracetamol 500mg'
					defaultValue={medication?.name}
					isRequired
				/>
				<Input
					name='description'
					label='Description'
					labelPlacement='outside'
					disabled={pending || isPending}
					placeholder='Short description...'
					defaultValue={medication?.description}
					isRequired
				/>
			</div>

			<div className='flex items-center justify-between w-full gap-4'>
				<Input
					name='category'
					label='Category'
					labelPlacement='outside'
					disabled={pending || isPending}
					placeholder='e.g. Analgesic'
					defaultValue={medication?.category}
					isRequired
				/>
				<Input
					name='quantity'
					label='Quantity'
					labelPlacement='outside'
					type='number'
					placeholder='e.g. 100'
					disabled={pending || isPending}
					defaultValue={medication?.quantity?.toString() || undefined}
					isRequired
				/>
			</div>

			<div className='flex items-center justify-between w-full gap-4'>
				<Input
					name='minStock'
					label='Minimum Stock'
					labelPlacement='outside'
					type='number'
					disabled={pending || isPending}
					placeholder='e.g. 10'
					defaultValue={medication?.minStock?.toString() || undefined}
					isRequired
				/>
				<Input
					name='lotNumber'
					label='Lot Number'
					labelPlacement='outside'
					placeholder='e.g. A1234'
					disabled={pending || isPending}
					defaultValue={medication?.lotNumber}
					isRequired
				/>
				<Input
					name='expiryDate'
					label='Expiry Date'
					disabled={pending || isPending}
					labelPlacement='outside'
					type='date'
					defaultValue={
						medication?.expiryDate
							? new Date(medication.expiryDate).toISOString().split('T')[0]
							: undefined
					}
					isRequired
				/>
			</div>

			{medication && (
				<Select
				className='w-md'
					name='status'
					label='Status'
					disabled={pending || isPending}
					labelPlacement='outside'
					defaultSelectedKeys={[medication.status]}
					placeholder='Select status'
					isRequired>
					{statusOptions.map(option => (
						<SelectItem key={option.value}>{option.label}</SelectItem>
					))}
				</Select>
			)}

			<Button disabled={pending || isPending} type='submit' color='primary'>
				{pending || isPending ? (
					<Loader2 className='animate-spin w-5 h-5 text-white' />
				) : medication ? (
					'Update Medication'
				) : (
					'Add Medication'
				)}
			</Button>

			{data && !data.success && (
				<div className='text-center text-destructive'>{data.message}</div>
			)}
		</Form>
	);
};

export default CreateOrUpdateMedicationForm;
