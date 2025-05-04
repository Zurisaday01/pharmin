import CreateMedicationForm from '@/components/forms/create-medication-form';
import { getMedicationById } from '@/lib/actions/medication.actions';
import { notFound } from 'next/navigation';

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
			<h1 className='text-2xl font-bold mb-4'>Update Medication</h1>
			<CreateMedicationForm medication={medication as unknown as Medication} />
		</div>
	);
};
export default MedicationUpdatePage;
