'use server';
import { signInFormSchema, signUpFormSchema } from '../validators';
import {  signIn, signOut } from '@/auth';
import { hash } from '@/lib/encrypt';
import { prisma } from '@/lib/db/prisma';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { formatError } from '../utils';

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
		// parse the user data from the form data
		const user = signUpFormSchema.parse({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword'),
		});

		// get the pain password
		const plainPassword = user.password;

		// hash the password
		user.password = await hash(plainPassword);

		// create the user in the database
		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		// sign in right after
		await signIn('credentials', {
			email: user.email,
			password: plainPassword,
		});

		console.log('User created successfully');

		return { success: true, message: 'User registered successfully' };
	} catch (error: unknown) {
		if (isRedirectError(error)) {
			throw error;
		}

		console.log('Error creating user', error);

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
export async function getAllUsers({
	limit = 5,
	page,
	query,
}: {
	limit?: number;
	page: number;
	query: string;
}) {
	const queryFilter: Prisma.UserWhereInput =
		query && query !== 'all'
			? {
					name: {
						contains: query,
						mode: 'insensitive',
					} as Prisma.StringFilter,
			  }
			: {};

	const data = await prisma.user.findMany({
		where: {
			...queryFilter,
		},
		orderBy: { createdAt: 'desc' },
		take: limit,
		skip: (page - 1) * limit,
	});

	const dataCount = await prisma.user.count();

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
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
