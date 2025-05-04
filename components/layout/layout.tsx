'use client';

import React from 'react';

import { SidebarContext } from './layout-context';
import { useLockedBody } from '@/hooks/useBodyLock';
import { SidebarWrapper } from '../sidebar/sidebar';
import { NavbarLayout } from './navbar';

interface Props {
	children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
	const [sidebarOpen, setSidebarOpen] = React.useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setLocked] = useLockedBody(false);
	const handleToggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
		setLocked(!sidebarOpen);
	};

	return (
		<SidebarContext.Provider
			value={{
				collapsed: sidebarOpen,
				setCollapsed: handleToggleSidebar,
			}}>
			<section className='flex'>
				<SidebarWrapper />
				<NavbarLayout>{children}</NavbarLayout>
			</section>
		</SidebarContext.Provider>
	);
};
