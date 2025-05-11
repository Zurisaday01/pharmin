'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Form, Button } from '@heroui/react';
import { Loader2 } from 'lucide-react';
import { updateMedicationStatus } from '@/lib/actions/medication.actions';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface InitalStateType {
	success: boolean;
	message: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialState: InitalStateType = {
	success: false,
	message: '',
};

async function handleUpdateMedicationStatus(
	_: typeof initialState,
	formData: FormData
) {
	return await updateMedicationStatus(formData);
}

const DeleteUpdateMedicationStatus = ({
	medicationId,
	onClose,
}: {
	medicationId: string;
	onClose: () => void;
}) => {
	const [data, action, isPending] = useActionState(
		handleUpdateMedicationStatus,
		{
			success: false,
			message: '',
		}
	);

	useEffect(() => {
		if (data?.success) {
			toast.success(data.message || 'Medication status updated successfully');
			onClose();
		}else if (data?.message) {
			toast.error(data.message);
		}
	}, [data, onClose]);

	const { pending } = useFormStatus();
	const { data: session } = useSession();

	const isAdmin = session?.user.role === 'ADMIN';

	return (
		<Form action={action} className='w-full max-w-sm flex flex-col gap-4'>
			<input type='hidden' name='id' value={medicationId} />

			<div className='flex gap-2 items-center justify-end'>
				<Button
					disabled={pending || isPending}
					color='danger'
					variant='light'
					onPress={onClose}>
					Close
				</Button>

				<Button
					disabled={pending || isPending || !isAdmin}
					type='submit'
					color={!isAdmin ? 'default' : 'danger'}>
					{pending || isPending ? (
						<Loader2 className='animate-spin w-5 h-5 text-white' />
					) : (
						'Yes, Remove'
					)}
				</Button>
			</div>
		</Form>
	);
};

export default DeleteUpdateMedicationStatus;
