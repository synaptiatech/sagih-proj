import { Box, Pagination } from '@mui/material';
import { PaginacionProps } from '../../props/PaginacionProps';

const Paginacion = ({ count, page, onChange }: PaginacionProps) => {
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			<Pagination
				count={count}
				color='primary'
				showFirstButton
				showLastButton
				page={page}
				onChange={onChange}
			/>
		</Box>
	);
};

export default Paginacion;
