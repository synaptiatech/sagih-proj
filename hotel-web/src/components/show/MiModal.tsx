import { Box, Modal } from '@mui/material';
import { style } from '../../theme/FormStyle';
import { ReactElement } from 'react';
import { ModalPortal } from '../form/ModalPortal';

interface MiModalProps {
	size: 'small' | 'medium' | 'm-large' | 'large';
	open: boolean;
	onClose: () => void;
	children: ReactElement;
}

const getStyleBySize = (size: 'small' | 'medium' | 'm-large' | 'large') => {
	switch (size) {
		case 'small':
			return {
				width: { xs: '90vw', sm: '60vw', md: '40vw' },
				maxHeight: '50vh',
				margin: 'auto',
				overflowY: 'scroll',
			};
		case 'medium':
			return {
				width: { xs: '90vw', sm: '70vw', md: '40vw' },
				maxHeight: '85vh',
				margin: 'auto',
				overflowY: 'scroll',
			};
		case 'm-large':
			return {
				width: { xs: '90vw', sm: '70vw', md: '60vw' },
				maxHeight: '85vh',
				margin: 'auto',
				overflowY: 'scroll',
			};
		case 'large':
			return {
				width: '95vw',
				maxHeight: '95vh',
				margin: 'auto',
				overflowY: 'scroll',
			};
	}
};

const MiModal = ({ size, open, onClose, children }: MiModalProps) => {
	return (
		<ModalPortal>
			<Modal
				open={open}
				onClose={onClose}
				sx={{ ...getStyleBySize(size) }}>
				<Box
					component='div'
					sx={{
						display: 'grid',
						justifyContent: 'stretch',
						alignItems: 'flex-start',
						height: 'fit-content',
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						// overflowY: 'scroll',
						// overflowX: 'hidden',
					}}>
					{children}
				</Box>
			</Modal>
		</ModalPortal>
	);
};

export default MiModal;
