import { Box, Button } from '@mui/material';

interface FormActionsProps {
	isNew: boolean;
	onBack: () => void;
	onDelete?: (row: any) => void;
	onPrint?: () => void;
}

const FormActions = ({
	isNew,
	onBack,
	onPrint,
	onDelete,
}: FormActionsProps) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				flexWrap: 'wrap',
				placeContent: 'center',
				placeItems: 'center',
				gap: 2,
			}}>
			<Button
				variant='text'
				color='secondary'
				type='button'
				onClick={onBack}>
				Cancelar
			</Button>
			{isNew && (
				<Button
					variant='text'
					color='error'
					type='button'
					onClick={onDelete}>
					Eliminar
				</Button>
			)}
			<Box sx={{ flexGrow: { xs: 0, md: 1 } }} />
			{!isNew && onPrint && (
				<Button
					variant='text'
					color='primary'
					type='button'
					onClick={onPrint}>
					Imprimir
				</Button>
			)}
			<Button variant='contained' type='submit'>
				Guardar
			</Button>
		</Box>
	);
};

export default FormActions;
