import { IconButton } from '@mui/material';
import { ButtonProps } from '../../props/ButtonProps';

export const MyIconButton = ({ children, handle }: ButtonProps) => {
	return (
		<IconButton className='px-4 py-2 rounded-md' onClick={handle}>
			{children}
		</IconButton>
	);
};
