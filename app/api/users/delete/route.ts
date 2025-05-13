import { deleteUser } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { id } = await req.json();

		if (!id) {
			return NextResponse.json(
				{ success: false, message: 'User ID is required' },
				{ status: 400 }
			);
		}

		const result = await deleteUser(id);

		if (!result.success) {
			return NextResponse.json(result, { status: 500 });
		}

		return NextResponse.json(result);
	} catch (error: unknown) {
		console.error('Error deleting user:', error);
		return NextResponse.json(
			{ success: false, message: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
