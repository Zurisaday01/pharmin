import UsersTable from '@/components/tables/users-table';
import { getAllUsers } from '@/lib/actions/user.actions';
import { requireAdmin } from '@/lib/auth-guard';

const UsersPage = async () => {
	await requireAdmin();
	const users = await getAllUsers();

	return (
		<>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold'>Users</h1>
				<p className='text-gray-500'>Manage your your users here.</p>
			</div>

			<UsersTable users={(users?.data as unknown as User[]) || []} />
		</>
	);
};
export default UsersPage;
