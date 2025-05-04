import { z } from 'zod';

// Schema for signing users in
export const signInFormSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for signing up a user
export const signUpFormSchema = z
	.object({
		name: z.string().min(3, 'Name must be at least 3 characters'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z
			.string()
			.min(6, 'Confirm password must be at least 6 characters'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

// Schema to insert reviews
export const insertReviewSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters'),
	description: z.string().min(3, 'Description must be at least 3 characters'),
	productId: z.string().min(1, 'Product is required'),
	userId: z.string().min(1, 'User is required'),
	rating: z.coerce
		.number()
		.int()
		.min(1, 'Rating must be at least 1')
		.max(5, 'Rating must be at most 5'),
});
