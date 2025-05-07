import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';
import { requireAdmin } from '@/lib/auth-guard';
import UpdateUserForm from '@/components/forms/update-user-form';

const AdminUserUpdatePage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	await requireAdmin();

	const { id } = await props.params;

	const user = await getUserById(id);

	if (!user) notFound();

	return (
		<>
			<div className='flex-1 space-y-4'>
				<h1 className='text-2xl font-bold'>Update User</h1>
				<UpdateUserForm user={user} />
			</div>
		</>
	);
};

export default AdminUserUpdatePage;
