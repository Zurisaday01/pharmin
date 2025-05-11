'use client';

import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { signInWithCredentials, signUpWithCredentials } from '@/lib/actions/user.actions';
import toast from 'react-hot-toast';
//components

import { Form, Button, Input } from '@heroui/react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const SignUpForm = () => {
	// //define the action state (server action function, initial state)
	const [data, action, isPending] = useActionState(signUpWithCredentials, {
		success: false,
		message: '',
	});
	const { pending } = useFormStatus();

	// // callback redirection logic
	const router = useRouter();

	// ✅ Show toast and redirect on success
	useEffect(() => {
		if (data?.success) {
			toast.success(data.message || 'Account created successfully');
			router.push('/dashboard');
		}else if (data?.message) {
			toast.error(data.message);
		}
	}, [data, router]);

	return (
		<Form action={action} className='w-full max-w-xs flex flex-col gap-4'>
			<div className='space-y-6 w-full'>
				<div className='flex flex-col gap-1  w-full'>
					<Input
						id='name'
						name='name'
						label='Name'
						labelPlacement='outside'
						type='text'
						autoComplete='off'
						isRequired
						placeholder='Enter your name'
						errorMessage='Please enter a valid name'
					/>
				</div>
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
				<div className='flex flex-col gap-1'>
					<Input
						isRequired
						label='Confirm Password'
						labelPlacement='outside'
						name='confirmPassword'
						placeholder='Confirm your password'
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
							'Sign Up'
						)}
					</Button>
				</div>

				{data && !data.success && (
					<div className='text-center text-destructive'>{data.message}</div>
				)}

				<div className='text-sm text-center text-muted-foreground'>
					Already have an account?{' '}
					<Link
						href='/sign-in'
						className='text-brown-100 dark:text-brown-50 transition-colors duration-150 underline hover:text-brown-50'>
						Sign In
					</Link>
				</div>
			</div>
		</Form>
	);
};
export default SignUpForm;
