import React from 'react';
import { Sidebar } from './sidebar.styles';

import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';

import { useSidebarContext } from '../layout/layout-context';
import { usePathname } from 'next/navigation';
import { HomeIcon, PillBottleIcon, Users2Icon } from 'lucide-react';

export const SidebarWrapper = () => {
	const pathname = usePathname();
	const { collapsed, setCollapsed } = useSidebarContext();

	return (
		<aside className='h-screen z-[20] sticky top-0'>
			{collapsed ? (
				<div className={Sidebar.Overlay()} onClick={setCollapsed} />
			) : null}
			<div
				className={Sidebar({
					collapsed: collapsed,
				})}>
				<div className={Sidebar.Header()}>
					<div className='flex items-center gap-2'>
						<div className='flex flex-col gap-4'>
							<h3 className='text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap'>
								Pharmin
							</h3>
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-between h-full'>
					<div className={Sidebar.Body()}>
						<SidebarItem
							title='Home'
							icon={<HomeIcon />}
							isActive={pathname === '/'}
							href='/dashboard'
						/>
						<SidebarMenu title='Main Menu'>
							<SidebarItem
								isActive={pathname === '/medications'}
								title='Medications'
								icon={<PillBottleIcon />}
								href='/dashboard/medications'
							/>
						</SidebarMenu>

						<SidebarMenu title='Others'>
							<SidebarItem
								isActive={pathname === '/users'}
								title='Users'
								href='/dashboard/users'
								icon={<Users2Icon />}
							/>
						</SidebarMenu>
					</div>
				</div>
			</div>
		</aside>
	);
};
