import CreateMedicationForm from '@/components/forms/create-medication-form';
import { getMedicationById } from '@/lib/actions/medication.actions';
import { notFound } from 'next/navigation';
import { Alert } from '@heroui/react';

const MedicationUpdatePage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	const { id } = await props.params;

	const medication = await getMedicationById(id);
	if (!medication) notFound();

	return (
		<div>
			{medication?.status === 'REMOVED' && (
				<Alert
					color='danger'
					description='This medication has been removed from the system.'
					title='Removed Medication'
					className='mb-4'
				/>
			)}

			{medication?.status === 'EXPIRED' && (
				<Alert
					color='warning'
					description='This medication has expired.'
					title='Expired Medication'
					className='mb-4'
				/>
			)}

			<h1 className='text-2xl font-bold mb-4'>Update Medication</h1>
			<CreateMedicationForm medication={medication as unknown as Medication} />
		</div>
	);
};
export default MedicationUpdatePage;
