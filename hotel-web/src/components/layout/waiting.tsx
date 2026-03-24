import { Skeleton, Grid } from '@mui/material';
import { gridStyle } from '../../theme/FormStyle';

const GridSkeleton = () => {
	return (
		<>
			<Skeleton variant='text' sx={{ width: '50%', height: 50, my: 4 }}>
				<Grid container sx={gridStyle}>
					{Array.from(
						new Array(12).map((_, index) => (
							<Skeleton
								key={index}
								variant='rectangular'
								sx={{ width: 150, height: 150 }}
							/>
						))
					)}
				</Grid>
			</Skeleton>
		</>
	);
};

export default GridSkeleton;
