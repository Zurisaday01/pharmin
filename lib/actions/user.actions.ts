'use server';
import { signInFormSchema, signUpFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { hash } from '@/lib/encrypt';
import { prisma } from '@/lib/db/prisma';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { revalidatePath } from 'next/cache';
import { formatError } from '../utils';
import { Role } from '@prisma/client';

// Sign in with credentials
export const signInWithCredentials = async (
	prevState: unknown,
	formData: FormData
) => {
	try {
		// parse the user data from the form data
		const user = signInFormSchema.parse({
			email: formData.get('email') as string,
			password: formData.get('password') as string,
		});

		await signIn('credentials', user);

		return { success: true, message: 'Signed in successfully' };
	} catch (error: unknown) {
		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: formatError(error) };
	}
};

// Sign user out
export async function signOutUser() {
	await signOut();
}

// Sign up with credentials
export async function signUpWithCredentials(
	prevState: unknown,
	formData: FormData
) {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword'),
		});

		const plainPassword = user.password;
		user.password = await hash(plainPassword);

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		const result = await signIn('credentials', {
			email: user.email,
			password: plainPassword,
			redirect: false, // ✅ Mantén esto para evitar navegación automática
		});

		if (result?.ok) {
			return { success: true, message: 'User registered successfully' };
		} else {
			return { success: false, message: 'User created, but sign-in failed' };
		}
	} catch (error: unknown) {
		if (isRedirectError(error)) {
			throw error;
		}

		console.error('Error creating user', error);
		return { success: false, message: formatError(error) };
	}
}

// Get user by the ID
export async function getUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: { id: userId },
	});
	if (!user) throw new Error('User not found');
	return user;
}

// Get all the users
export async function getAllUsers() {
	const data = await prisma.user.findMany({
		orderBy: { createdAt: 'desc' },
	});

	return {
		data,
	};
}

// Delete a user
export async function deleteUser(id: string) {
	try {
		await prisma.user.delete({ where: { id } });

		revalidatePath('/admin/users');

		return {
			success: true,
			message: 'User deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
export async function updateUser(formData: FormData) {
	const id = formData.get('id')?.toString();
	const name = formData.get('name')?.toString();
	const role = formData.get('role')?.toString();

	if (!id || !name || !role) {
		return { success: false, message: 'Missing fields' };
	}

	try {
		await prisma.user.update({
			where: { id },
			data: {
				name,
				role: role as Role,
			},
		});

		revalidatePath('/dashboard/users');

		return {
			success: true,
			message: 'User updated successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export const getUserStats = async () => {
	try {
		const totalUsers = await prisma.user.count();
		return {
			totalUsers,
		};
	} catch (error) {
		console.error('Error fetching user stats:', error);
		return {
			totalUsers: 0,
		};
	}
};