import type { Metadata } from 'next';
import './globals.css';

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
					<HeroProvider>{children}</HeroProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
