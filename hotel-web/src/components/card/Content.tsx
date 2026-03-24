import { Box, Container, Typography } from '@mui/material';
import { CardContentProps } from '../../props/CardProps';

export const Content = ({ children }: CardContentProps) => {
	return (
		<Box component='main' sx={{ flexGrow: 1, py: 1 }}>
			<Container maxWidth={false}>{children}</Container>
		</Box>
	);
};

export const ContentWithTitle = ({ title, children }: CardContentProps) => {
	return (
		<Content>
			<>
				<Typography variant='h4' sx={{ m: 2 }}>
					{title}
				</Typography>
				{children}
			</>
		</Content>
	);
};
