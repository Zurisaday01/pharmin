'use server';

import { prisma } from '@/lib/db/prisma';

export async function getAllInventoryMovements() {
	const data = await prisma.inventoryMovement.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			product: {
				select: {
					name: true,
				},
			},
		},
	});

	return {
		data,
	};
}
export async function getTopConsumedProducts(startDate?: Date, endDate?: Date) {
	// Step 1: Get the initial consumption data using groupBy
	const grouped = await prisma.inventoryMovement.groupBy({
		by: ['productId'],
		where: {
			movementType: 'CONSUMPTION',
			createdAt: {
				gte: startDate ?? new Date('2000-01-01'),
				lte: endDate ?? new Date(),
			},
		},
		_count: {
			productId: true,
		},
		orderBy: {
			_count: {
				productId: 'desc',
			},
		},
	});

	// Step 2: Parse the descriptions to extract the actual consumed units
	const consumptionMap: Record<string, number> = {};

	// Fetch all the inventory movements
	const inventoryMovements = await prisma.inventoryMovement.findMany({
		where: {
			movementType: 'CONSUMPTION',
			createdAt: {
				gte: startDate ?? new Date('2000-01-01'),
				lte: endDate ?? new Date(),
			},
		},
	});

	// Loop through each inventory movement to extract consumed units from descriptions
	inventoryMovements.forEach(movement => {
		const match = movement.description.match(/Consumed (\d+) units/);
		if (match) {
			const consumedUnits = parseInt(match[1], 10); // Parse the consumed units from the description
			if (consumptionMap[movement.productId]) {
				consumptionMap[movement.productId] += consumedUnits; // Accumulate the units
			} else {
				consumptionMap[movement.productId] = consumedUnits;
			}
		}
	});

	// Step 3: Merge the data (grouped data and consumptionMap)
	const productIds = grouped.map(g => g.productId);
	const products = await prisma.product.findMany({
		where: {
			id: { in: productIds },
		},
		select: {
			id: true,
			name: true,
		},
	});

	// Step 4: Create the final result including both consumption counts
	const result = grouped.map(g => {
		const product = products.find(p => p.id === g.productId);
		const descriptionUnits = consumptionMap[g.productId] || 0; // Units extracted from description
		const initialConsumptionCount = g._count.productId || 0; // Consumption count from groupBy

		// Only add the description units once for each product, no duplication
		const totalUnitsConsumed = descriptionUnits;

		return {
			productId: g.productId,
			productName: product?.name || 'Unknown',
			consumptionCount: initialConsumptionCount,
			totalUnitsConsumed, // Combine both counts
		};
	});

	return {
		data: result,
	};
}
