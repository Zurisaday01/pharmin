'use client';

import { useState } from 'react';
import { DateRangePicker, RangeValue, DateValue, Button } from '@heroui/react';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { getTopConsumedProducts } from '@/lib/actions/inventory-movement.actions';

export default function ConsumptionReportDownload() {
	const [dateRange, setDateRange] = useState<RangeValue<DateValue | null>>({
		start: null,
		end: null,
	});

	const handleDownload = async () => {
		if (!dateRange.start || !dateRange.end) {
			alert('Please select a valid date range.');
			return;
		}

		const startDate = new Date(
			dateRange.start!.year,
			dateRange.start!.month - 1,
			dateRange.start!.day
		);
		const endDate = new Date(
			dateRange.end!.year,
			dateRange.end!.month - 1,
			dateRange.end!.day
		);

		endDate.setHours(23, 59, 59, 999);

		const { data } = await getTopConsumedProducts(startDate, endDate);

		const formatted = data.map(item => ({
			'Product ID': item.productId,
			'Product Name': item.productName,
			'Consumption Count': item.consumptionCount,
			'Total Units Consumed': item.totalUnitsConsumed,
		}));

		// Format date range string
		const startStr = startDate.toISOString().split('T')[0];

		const adjustedEndDate = new Date(endDate);
		adjustedEndDate.setHours(0, 0, 0, 0); // Set hours to 00:00:00
		const endStr = adjustedEndDate.toISOString().split('T')[0];

		const csvConfig = mkConfig({
			useKeysAsHeaders: true,

			filename: `Top Consumed Products ${
				dateRange ? `from ${startStr} to ${endStr}` : ''
			}`,
			title: `Top Consumed Products ${
				dateRange ? `from ${startStr} to ${endStr}` : ''
			}`,
		});

		const csv = generateCsv(csvConfig)(formatted);
		download(csvConfig)(csv);
	};

	return (
		<div className='flex gap-4 items-center'>
			<DateRangePicker
				isRequired
				label='Filter by date range'
				value={dateRange as RangeValue<DateValue>}
				onChange={value => setDateRange(value ?? { start: null, end: null })}
				className='max-w-xs'
			/>

			<Button
				onClick={handleDownload}
				className='w-full'
				color={!dateRange.start || !dateRange.end ? 'default' : 'primary'}
				disabled={!dateRange.start || !dateRange.end}>
				Download Top Products Report
			</Button>
		</div>
	);
}
