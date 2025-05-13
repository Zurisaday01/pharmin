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
