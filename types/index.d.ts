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
}

export {};
