import CreateMedicationForm from '@/components/forms/create-medication-form';


const CreateMedication = async () => {

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4'>Create Medication</h1>
			<CreateMedicationForm />
		</div>
	);
};
export default CreateMedication;
