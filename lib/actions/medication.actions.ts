'use server';
import { revalidatePath } from 'next/cache';
import { prisma } from '../db/prisma';

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

	const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

	try {
		await prisma.product.create({
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
	// Update logic (Prisma example)
	try {
		await prisma.product.update({
			where: { id },
			data: { status: 'REMOVED' },
		});

		revalidatePath('/dashboard/medications');

		return { success: true, message: 'Medication removed successfully' };
	} catch (error) {
		console.error('Error fetching medications:', error);
		return { success: false, message: 'Failed to remove medication' };
	}
};

export const updateMedication = async (formData: FormData) => {
	const id = formData.get('id') as string;

	if (!id) return { success: false, message: 'Medication ID is missing.' };

	try {
		await prisma.product.update({
			where: { id },
			data: {
				name: formData.get('name') as string,
				description: formData.get('description') as string,
				category: formData.get('category') as string,
				quantity: Number(formData.get('quantity')),
				minStock: Number(formData.get('minStock')),
				lotNumber: formData.get('lotNumber') as string,
				expiryDate: new Date(formData.get('expiryDate') as string),
				status: formData.get('status') as 'ACTIVE' | 'REMOVED' | 'EXPIRED',
			},
		});

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
