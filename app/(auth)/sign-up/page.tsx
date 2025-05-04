import FormContainer from '@/components/auth/form-container';
import SignUpForm from '@/components/auth/signup-form';

const SignUpPage = () => {
	return (
		<>
			<FormContainer title='Sign Up' description='Enter your information below'>
				<SignUpForm />
			</FormContainer>
		</>
	);
};
export default SignUpPage;
