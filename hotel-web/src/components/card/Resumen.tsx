import { Box, CardContent, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { CardContentProps } from '../../props/CardProps';

export const CardResume = ({ title, children }: CardContentProps) => {
	return (
		<Card sx={{ minWidth: 300 }}>
			<CardContent>
				<Typography variant='h5' component='div' gutterBottom>
					{title}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						placeContent: 'center',
						placeItems: 'center',
						flexWrap: 'wrap',
						margin: 5,
						gap: 4,
					}}>
					{children}
				</Box>
			</CardContent>
		</Card>
	);
};
