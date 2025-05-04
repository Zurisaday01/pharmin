import MedicationsTable from '@/components/tables/medications-table';
import { getAllMedications } from '@/lib/actions/medication.actions';

import Link from 'next/link';
const MedicationsPage = async () => {
	const medications = await getAllMedications();

	return (
		<>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold'>Medications</h1>
				<p className='text-gray-500'>Manage your medications here.</p>
				{/* Add your medications management components here */}
				<Link
					className='text-blue-500 hover:text-blue-700'
					href='/dashboard/medications/create'>
					Create
				</Link>
			</div>

			<MedicationsTable
				medications={(medications?.data as unknown as Medication[]) || []}
			/>
		</>
	);
};
export default MedicationsPage;
