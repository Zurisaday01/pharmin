'use client';

import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { signInWithCredentials } from '@/lib/actions/user.actions';
//components

import { Form, Button, Input } from '@heroui/react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const SignInForm = () => {
	// //define the action state (server action function, initial state)
	const [data, action, isPending] = useActionState(signInWithCredentials, {
		success: false,
		message: '',
	});
	const { pending } = useFormStatus();

	// // callback redirection logic
	const router = useRouter();

	// ✅ Show toast and redirect on success
	useEffect(() => {
		if (data?.success) {
			router.push('/dashboard');
		}
	}, [data, router]);

	return (
		<Form action={action} className='w-full max-w-xs flex flex-col gap-4'>
			<div className='space-y-6 w-full'>
				<div className='flex flex-col gap-1'>
					<Input
						isRequired
						label='Email'
						labelPlacement='outside'
						name='email'
						placeholder='Enter your email'
						type='email'
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<Input
						isRequired
						label='Password'
						labelPlacement='outside'
						name='password'
						placeholder='Enter your password'
						type='password'
					/>
				</div>

				<div>
					<Button
						disabled={pending || isPending}
						className='w-full'
						type='submit'
						color='primary'>
						{pending || isPending ? (
							<Loader2 className='animate-spin w-12 h-12 text-white' />
						) : (
							'Sign In'
						)}
					</Button>
				</div>

				{data && !data.success && (
					<div className='text-center text-destructive'>{data.message}</div>
				)}

				<div className='text-sm text-center text-muted-foreground'>
					Don&apos;t have an account?{' '}
					<Link
						href='/sign-up'
						className='text-brown-100 dark:text-brown-50 transition-colors duration-150 underline hover:text-brown-50'>
						Sign Up
					</Link>
				</div>
			</div>
		</Form>
	);
};
export default SignInForm;
