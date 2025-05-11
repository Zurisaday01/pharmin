import { getMedicalStats } from "@/lib/actions/medication.actions";
import { getUserStats } from "@/lib/actions/user.actions";
import { Card } from "@heroui/card";

const DashboardPage = async () => {
	const { totalMedications, totalUnits } = await getMedicalStats();
	const { totalUsers } = await getUserStats();
	return (
		<>
			<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
			<p className='text-gray-500'>Welcome to your dashboard!</p>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<Card className='p-8 bg-white shadow-md'>
					<h2 className='text-lg font-semibold'>Medicamentos registrados</h2>
					<p className="text-5xl mt-2">{totalMedications}</p>
				</Card>
				<Card className='p-8 bg-white shadow-md'>
					<h2 className='text-lg font-semibold'>Unidades totales</h2>
					<p className="text-5xl mt-2">{totalUnits}</p>
				</Card>
				<Card className='p-8 bg-white shadow-md'>
					<h2 className='text-lg font-semibold'>Usuarios registrados</h2>
					<p className="text-5xl mt-2">{totalUsers}</p>
				</Card>
			</div>

		</>
	)
};
export default DashboardPage;
