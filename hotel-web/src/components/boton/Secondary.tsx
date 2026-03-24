import { ButtonProps } from '../../props/ButtonProps';

export const MySecondaryButton = ({ children, handle }: ButtonProps) => {
	return (
		<button
			className='px-4 py-2 rounded-md bg-pink-500 text-white'
			onClick={handle}>
			{children}
		</button>
	);
};
