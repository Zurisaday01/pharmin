import { Card, CardHeader, CardBody } from '@heroui/card';

interface FormContainerProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

const FormContainer = ({
	title,
	description,
	children,
}: FormContainerProps) => {
	return (
		<div className='flex min-h-screen items-center justify-center p-4 '>
			<Card className='w-full max-w-sm'>
				<CardHeader className='flex flex-col items-center gap-2 mb-6'>
					<h1 className='text-center text-2xl'>{title}</h1>
					<p className='text-center text-neutral-400'>{description}</p>
				</CardHeader>
				<CardBody className='flex flex-col gap-4 items-center'>{children}</CardBody>
			</Card>
		</div>
	);
};

export default FormContainer;
