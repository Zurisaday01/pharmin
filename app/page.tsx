import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
	const session = await auth();

	console.log('Session:', session);

	if (!session?.user) {
		redirect('/sign-in');
	} else {
		redirect('/dashboard/medications');
	}
}
