import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Box, Divider } from '@mui/material';
import { rowFlex } from '../theme/FormStyle';

const FilasBox = ({ children }: { children: ReactJSXElement }) => {
	return (
		<>
			<Box sx={rowFlex}>{children}</Box>
			<Divider sx={{ my: 2 }} />
		</>
	);
};

export default FilasBox;
