// app/providers.tsx

import { HeroUIProvider } from '@heroui/react';
// import { ToastProvider } from '@heroui/toast';

export function HeroProvider({ children }: { children: React.ReactNode }) {
	return (
		<HeroUIProvider>
			{children}
			{/* <ToastProvider /> */}
		</HeroUIProvider>
	);
}
