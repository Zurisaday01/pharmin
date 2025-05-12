import {
	getLowStockMedications,
	getMedicalStats,
} from '@/lib/actions/medication.actions';
import { getUserStats } from '@/lib/actions/user.actions';
import { Card } from '@heroui/card';
import MedicationPieChart from '@/components/charts/medication-pie-chart';
import { getAllMedications } from '@/lib/actions/medication.actions';
import { LowStockTable } from '@/components/tables/low-stock-table';

const DashboardPage = async () => {
	const { totalMedications, totalUnits } = await getMedicalStats();
	const { totalUsers } = await getUserStats();
	const result = await getAllMedications();
	const lowStockMeds = await getLowStockMedications();
	const medications = result?.data ?? [];

	return (
		<>
			<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
			<p className='text-gray-500'>Welcome to your dashboard!</p>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<Card className='p-8 bg-white shadow-md'>
					<h2 className='text-lg font-semibold'>Registered Medicines</h2>
					<p className='text-5xl mt-2'>{totalMedications}</p>
				</Card>
				<Card className='p-8 bg-white shadow-md'>
					<h2 className='text-lg font-semibold'>Total Units</h2>
					<p className='text-5xl mt-2'>{totalUnits}</p>
				</Card>
				<Card className='p-8 bg-white shadow-md'>
					<h2 className='text-lg font-semibold'>Registered Users</h2>
					<p className='text-5xl mt-2'>{totalUsers}</p>
				</Card>
			</div>

			<main className='mt-8 flex gap-4'>
				<Card className='p-8 bg-white shadow-md flex-1 '>
					<MedicationPieChart medications={medications} />
				</Card>
				<Card className='p-8 bg-white shadow-md'>
					<h2 className='text-lg font-semibold'>Low Stock Medicines</h2>
					<LowStockTable data={lowStockMeds?.data as unknown as Medication[]} />
				</Card>
			</main>
		</>
	);
};
export default DashboardPage;
