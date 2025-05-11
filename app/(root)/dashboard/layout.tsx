import { Layout } from '@/components/layout/layout';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Toaster position='top-center' />
			<Layout>{children}</Layout>
		</>
	);
}
