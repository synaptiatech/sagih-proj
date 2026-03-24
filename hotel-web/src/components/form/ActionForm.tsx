import { Box, Button } from '@mui/material';
import { ActionFormProps } from '../../props/ActionProps';

const ActionForm = ({
	isEditing,
	onAdd,
	onDelete,
	onEdit,
	onPrint,
}: ActionFormProps) => {
	if (isEditing)
		return (
			<Box display='flex' gap='2'>
				<Button
					variant='text'
					color='error'
					type='button'
					onClick={onDelete}>
					Eliminar
				</Button>
				<Box flexGrow='1' />
				<Button
					variant='text'
					color='primary'
					type='button'
					onClick={onPrint}>
					Imprimir
				</Button>
				<Button
					variant='contained'
					color='primary'
					type='button'
					onClick={onEdit}>
					Guardar
				</Button>
			</Box>
		);

	return (
		<Box display='flex' gap='2'>
			<Box flexGrow='1' />
			<Button variant='contained' color='primary' type='submit'>
				Guardar
			</Button>
		</Box>
	);
};

export default ActionForm;
