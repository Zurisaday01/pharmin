import { Button } from '@heroui/react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Unauthorized Access',
};

export default function UnauthorizedPage() {
	return (
		<div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen relative'>
			<div className='absolute top-4 left-4'>
				<h1 className='text-blue-500 font-bold text-2xl'>Pharmin</h1>
			</div>
			<div className='p-6 w-1/3 rounded-lg shadow-md text-center bg-white flex flex-col items-center'>
				<h1 className='text-3xl font-bold mb-4'>Unauthorized Access</h1>
				<p className='text-destructive mb-3'>
					You do not have permission to access this page. This page is restricted to only admins.
				</p>
				<Button color='primary'>
					<Link href='/'>Back To Home</Link>
				</Button>
			</div>
		</div>
	);
}
