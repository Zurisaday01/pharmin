declare global {
	interface Medication {
		id: string;
		name: string;
		description: string;
		category: string;
		quantity: number;
		minStock: number;
		lotNumber: string;
		expiryDate: Date;
		status: 'ACTIVE' | 'REMOVED' | 'EXPIRED';
		createdAt: string;
		updatedAt: string;
	}

	interface User {
		id: string;
		name: string;
		email: string;
		role: string;
		createdAt: string;
		updatedAt: string;
	}

	interface InventoryMovement {
		id: string;
		productId: string;
		movementType: 'ADDITION' | 'REMOVAL' | 'UPDATE';
		description: string;
		createdBy: string;
		createdAt: string;
		product: Medication
	}
}

export {};
