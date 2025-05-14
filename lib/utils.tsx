import { AuthError } from 'next-auth';

interface AError extends AuthError {
	type?: string;
}

// Format errors
export function formatError(error: any) {
	if (error.name === 'ZodError') {
		// Handle Zod error
		const fieldErrors = Object.keys(error.errors).map(
			field => error.errors[field].message
		);

		return fieldErrors.join('. ');
	} else if (
		error.name === 'PrismaClientKnownRequestError' &&
		error.code === 'P2002'
	) {
		// Handle Prisma error
		const field = error.meta?.target ? error.meta.target[0] : 'Field';
		return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
	} else if ((error as AError)?.type === 'CredentialsSignin') {
		// Handle credentials error
		return 'Invalid credentials';
	} else {
		// Handle other errors
		return typeof error.message === 'string'
			? error.message
			: JSON.stringify(error.message);
	}
}
