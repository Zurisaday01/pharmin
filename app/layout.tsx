import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

import AuthProvider from '@/components/providers/auth-provider';
import { HeroProvider } from '@/components/providers/heroui-provider';

export const metadata: Metadata = {
	title: 'Pharmin',
	description: 'Your pharmacy, under control.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='light' suppressHydrationWarning>
			<body>
				<AuthProvider>
					<HeroProvider>
						{children}
						<Toaster position='top-center' />
						</HeroProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
