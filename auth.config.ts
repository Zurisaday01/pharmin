import type { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from './lib/encrypt';

export const authConfig = {
	pages: {
		signIn: '/sign-in',
		error: '/sign-in',
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			credentials: {
				email: { type: 'email' },
				password: { type: 'password' },
			},
			async authorize(credentials) {
				if (credentials == null) return null;

				// Find user in database
				const user = await prisma.user.findFirst({
					where: {
						email: credentials.email as string,
					},
				});

				// Check if user exists and if the password matches
				if (user && user.password) {
					const isMatch = await compare(
						credentials.password as string,
						user.password
					);

					// If password is correct, return user
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
					} else {
						return null;
					}
				}
				// If user does not exist or password does not match return null
				return null;
			},
		}),
	],
	callbacks: {
		async session({ session, user, trigger, token }: any) {
			// Set the user ID from the token
			session.user.id = token.sub;
			session.user.role = token.role;
			session.user.name = token.name;

			// If there is an update, set the user name
			if (trigger === 'update') {
				session.user.name = user.name;
			}

			return session;
		},
		async jwt({ token, user, trigger, session }: any) {
			// Assign user fields to token
			if (user) {
				token.id = user.id;
				token.role = user.role;

				// If user has no name then use the email
				if (user.name === 'NO_NAME') {
					token.name = user.email!.split('@')[0];

					// Update database to reflect the token name
					await prisma.user.update({
						where: { id: user.id },
						data: { name: token.name },
					});
				}
			}

			// Handle session updates
			if (session?.user.name && trigger === 'update') {
				token.name = session.user.name;
			}

			return token;
		},
		authorized({ request, auth }: any) {
			// Array of regex patterns of paths we want to protect
			const protectedPaths = [/\/dashboard/];

			// Get pathname from the req URL object
			const { pathname } = request.nextUrl;

			// Check if user is not authenticated and accessing a protected path
			if (!auth && protectedPaths.some(p => p.test(pathname))) return false;

			return true;
		},
	},
} satisfies NextAuthConfig;
