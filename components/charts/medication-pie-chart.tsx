'use client';

import { Pie } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type Medication = {
	name: string;
	quantity: number;
};

export default function MedicationPieChart({
	medications,
}: {
	medications: Medication[];
}) {
	const data = {
		labels: medications.map(m => m.name),
		datasets: [
			{
				label: 'Unidades por medicamento',
				data: medications.map(m => m.quantity),
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#4BC0C0',
					'#9966FF',
					'#FF9F40',
					'#C9CBCF',
					'#7EC857',
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className='w-full md:w-1/2 lg:w-1/3 mx-auto'>
			<h2 className='text-center text-xl font-semibold mb-4'>
				Distribución de medicamentos
			</h2>
			<Pie data={data} />
		</div>
	);
}
