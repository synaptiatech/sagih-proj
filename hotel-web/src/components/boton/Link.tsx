import { ButtonProps } from '../../props/ButtonProps';

export const MyLinkButton = ({ children, handle }: ButtonProps) => {
	return (
		<button className='py-2 bg-transparent text-pink-500' onClick={handle}>
			{children}
		</button>
	);
};
