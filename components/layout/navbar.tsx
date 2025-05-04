import {
	Navbar,
	NavbarContent,
	Avatar,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from '@heroui/react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

interface Props {
	children: React.ReactNode;
}

export const NavbarLayout = ({ children }: Props) => {
	const { data: session } = useSession();

	const handleSignOut = () => {
		signOut({
			callbackUrl: '/sign-in',
		});
	};

	return (
		<div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
			<Navbar
				isBordered
				className='w-full'
				classNames={{
					wrapper: 'w-full max-w-full',
				}}>
				<NavbarContent>
					<Dropdown>
						<DropdownTrigger>
							<Avatar className='ml-auto' src={session?.user?.image ?? ''} />
						</DropdownTrigger>
						<DropdownMenu aria-label='Static Actions'>
							<DropdownItem
								key='delete'
								className='text-danger'
								color='danger'
								onClick={handleSignOut}>
								Sign out
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarContent>
			</Navbar>
			<div className='p-3'>{children}</div>
		</div>
	);
};

export default NavbarLayout;
