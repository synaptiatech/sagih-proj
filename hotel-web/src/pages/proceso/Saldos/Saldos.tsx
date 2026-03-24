import React from 'react';
import { Content, ContentWithTitle } from '../../../components/card/Content';
import { Box, Button, Card } from '@mui/material';
import { dataPost } from '../../../services/fetching.service';
import swal from 'sweetalert';
import { handleError } from '../../../utils/HandleError';

export type SaldosProps = Record<string, unknown>;

const Saldos: React.FC<SaldosProps> = () => {
	const handleRecalculate = async () => {
		try {
			await dataPost({
				path: 'saldos',
				data: {},
			});
			swal(
				'Actualización de saldos',
				'Los saldos se han actualizado correctamente',
				'success'
			);
		} catch (error) {
			handleError('Error al actualizar los saldos', error);
		}
	};

	return (
		<>
			<ContentWithTitle title='Actualización de saldos'>
				<Card>
					<Content>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								flexWrap: 'wrap',
								gap: 2,
								p: 2,
							}}>
							<Button
								variant='contained'
								color='primary'
								onClick={handleRecalculate}>
								Actualizar datos
							</Button>
						</Box>
					</Content>
				</Card>
			</ContentWithTitle>
		</>
	);
};

export default Saldos;
