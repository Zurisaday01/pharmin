import { auth } from '@/auth';
import FormContainer from '@/components/auth/form-container';
import SignInForm from '@/components/auth/signin-form';
import { redirect } from 'next/navigation';

const SignInPage = async (props: {
	searchParams: Promise<{
		callbackUrl: string;
	}>;
}) => {
	const { callbackUrl } = await props.searchParams;

	const session = await auth();

	if (session) {
		return redirect(callbackUrl || '/');
	}
	return (
		<>
			<FormContainer title='Sign In' description='Sign in to your account'>
				<SignInForm />
			</FormContainer>
		</>
	);
};
export default SignInPage;
