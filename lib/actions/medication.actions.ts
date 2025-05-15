'use server';
import { revalidatePath } from 'next/cache';
import { prisma } from '../db/prisma';
import { MovementType, Product } from '@prisma/client';
import { auth } from '@/auth';

export const createMedication = async (formData: FormData) => {
	const name = formData.get('name') as string;
	const description = formData.get('description') as string;
	const category = formData.get('category') as string;
	const quantity = Number(formData.get('quantity'));
	const minStock = Number(formData.get('minStock'));
	const lotNumber = formData.get('lotNumber') as string;
	const expiryDateStr = formData.get('expiryDate') as string;

	if (!name || isNaN(quantity) || isNaN(minStock)) {
		return {
			success: false,
			message: 'Name, quantity, and minStock are required.',
		};
	}

	// get the current user session
	const session = await auth();

	const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

	try {
		const newProduct = await prisma.product.create({
			data: {
				name,
				description,
				category,
				quantity,
				minStock,
				lotNumber,
				expiryDate,
			},
		});

		// Create an inventory movement record
		await prisma.inventoryMovement.create({
			data: {
				productId: newProduct.id,
				description: 'Created new medication entry',
				movementType: 'ADDITION',
				createdBy: session?.user?.name as string, // You'll need to pass this
			},
		});

		revalidatePath('/dashboard/medications');

		return {
			success: true,
			message: 'Medication created successfully.',
		};
	} catch (error) {
		console.error('Error creating medication:', error);
		return {
			success: false,
			message: 'Failed to create medication.',
		};
	}
};

export const getAllMedications = async () => {
	try {
		const medications = await prisma.product.findMany();

		return {
			data: medications,
		};
	} catch (error) {
		console.error('Error fetching medications:', error);
	}
};

export const updateMedicationStatus = async (formData: FormData) => {
	const id = formData.get('id') as string;

	if (!id) {
		return { success: false, message: 'Missing ID' };
	}

	// get the current user session
	const session = await auth();

	try {
		const product = await prisma.product.update({
			where: { id },
			data: { status: 'REMOVED' },
		});

		// Create an inventory movement record
		await prisma.inventoryMovement.create({
			data: {
				productId: product.id,
				description: 'Removed a medication',
				movementType: 'REMOVAL',
				createdBy: session?.user?.name as string, // You'll need to pass this
			},
		});

		revalidatePath('/dashboard/medications');
		revalidatePath('/dashboard/inventory-movements');

		return { success: true, message: 'Medication removed successfully' };
	} catch (error) {
		console.error('Error fetching medications:', error);
		return { success: false, message: 'Failed to remove medication' };
	}
};

export const updateMedication = async (formData: FormData) => {
	const id = formData.get('id') as string;

	if (!id) return { success: false, message: 'Medication ID is missing.' };

	const session = await auth();

	try {
		const existing = await prisma.product.findUnique({ where: { id } });
		if (!existing) return { success: false, message: 'Medication not found.' };

		const updatedQuantity = Number(formData.get('quantity'));
		const newStatus = formData.get('status') as
			| 'ACTIVE'
			| 'REMOVED'
			| 'EXPIRED';
		const updateData = {
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			category: formData.get('category') as string,
			quantity: updatedQuantity,
			minStock: Number(formData.get('minStock')),
			lotNumber: formData.get('lotNumber') as string,
			expiryDate: new Date(formData.get('expiryDate') as string),
			status: newStatus,
		};

		await prisma.product.update({
			where: { id },
			data: updateData,
		});

		const movementLogs = [];
		const user = session?.user?.name || 'Unknown';

		// Stock increased -> ADDED units
		if (updatedQuantity > existing.quantity) {
			movementLogs.push({
				productId: id,
				description: `Added ${updatedQuantity - existing.quantity} more units`,
				movementType: 'ADDITION' as MovementType,
				createdBy: user,
			});
		}

		// Stock decreased -> CONSUMED units
		if (updatedQuantity < existing.quantity) {
			movementLogs.push({
				productId: id,
				description: `Consumed ${existing.quantity - updatedQuantity} units`,
				movementType: 'CONSUMPTION' as MovementType,
				createdBy: user,
			});
		}

		// Check for general updates (excluding quantity and status)
		const otherFieldsChanged =
			existing.name !== updateData.name ||
			existing.description !== updateData.description ||
			existing.category !== updateData.category ||
			existing.minStock !== updateData.minStock ||
			existing.lotNumber !== updateData.lotNumber ||
			existing.expiryDate?.toISOString() !==
				updateData.expiryDate.toISOString();

		if (otherFieldsChanged) {
			movementLogs.push({
				productId: id,
				description: 'Updated medication details',
				movementType: 'UPDATE' as MovementType,
				createdBy: user,
			});
		}

		// Log REMOVAL if status changed to EXPIRED
		if (existing.status !== 'EXPIRED' && newStatus === 'EXPIRED') {
			movementLogs.push({
				productId: id,
				description: 'Medication marked as expired',
				movementType: 'REMOVAL',
				createdBy: user,
			});
		}

		if (movementLogs.length > 0) {
			await prisma.inventoryMovement.createMany({
				data: movementLogs as InventoryMovement[],
			});
		}

		revalidatePath('/dashboard/medications');
		revalidatePath('/dashboard/inventory-movements');

		return { success: true, message: 'Medication updated successfully' };
	} catch (error) {
		console.error('Error updating medication:', error);
		return { success: false, message: 'Failed to update medication' };
	}
};

export const getMedicationById = async (id: string) => {
	try {
		const medication = await prisma.product.findUnique({
			where: { id },
		});

		return medication;
	} catch (error) {
		console.error('Error fetching medication:', error);
	}
};

export const getMedicalStats = async () => {
	try {
		const totalMedications = await prisma.product.count();
		const totalUnits = await prisma.product.aggregate({
			_sum: {
				quantity: true,
			},
		});

		return {
			totalMedications,
			totalUnits: totalUnits._sum.quantity ?? 0,
		};
	} catch (error) {
		console.error('Error fetching medical stats:', error);
		return {
			totalMedications: 0,
			totalUnits: 0,
		};
	}
};

export const getLowStockMedications = async () => {
	try {
		const lowStockMeds = await prisma.$queryRaw<Product[]>`
			SELECT * FROM "Product"
			WHERE "quantity" < "minStock" AND "status" = 'ACTIVE'
		`;

		return { success: true, data: lowStockMeds };
	} catch (error) {
		console.error('Error fetching low stock medications:', error);
		return { success: false, data: [] };
	}
};
