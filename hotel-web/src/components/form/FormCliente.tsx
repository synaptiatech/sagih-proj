import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { URI } from '../../consts/Uri';
import { useFetch } from '../../hooks/useFetch';
import {
	ClienteProps,
	ClienteType,
	TClientEntity,
	schemaCliente,
} from '../../props/ClienteProps';
import { PaisType } from '../../props/PaisProps';
import {
	dataDelete,
	dataPost,
	dataUpdate,
} from '../../services/fetching.service';
import { gridStyle } from '../../theme/FormStyle';
import { handleDelete, handleError } from '../../utils/HandleError';
import { MiAutocomplete } from '../Autocomplete';
import ErrorLayout from '../layout/error';
import GridSkeleton from '../layout/waiting';
import FormActions from '../show/FormActions';
import { TResult } from '../../models/TResult';
import { ModalPortal } from './ModalPortal';

const FormCliente = ({
	cliente,
	setCliente,
	onClose,
	...props
}: ClienteProps) => {
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<ClienteType>({
		defaultValues: {
			codigo: cliente?.codigo || 0,
			nombre: cliente?.nombre || '',
			nombre_c: cliente?.nombre_c || '',
			nit: cliente?.nit || '',
			nit_factura: cliente?.nit_factura || '',
			direccion: cliente?.direccion || '',
			direccion_factura: cliente?.direccion_factura || '',
			telefono_celular: cliente?.telefono_celular || 0,
			telefono_casa: cliente?.telefono_casa || 0,
			tipo_cliente: cliente?.tipo_cliente || '',
			dpi: cliente?.dpi || '',
			pais_origen: cliente?.pais_origen || -1,
		},
		resolver: yupResolver(schemaCliente),
		mode: 'onBlur',
	});
	const {
		data: countries,
		isLoading,
		isError,
	} = useFetch({
		path: `${URI.pais}/all`,
		table: 'pais',
	});

	const forwardSave = async (body: ClienteType) => {
		try {
			console.log(`Form cliente submit ${body} ${isDirty}`);
			if (cliente?.codigo === undefined) {
				let { data } = await dataPost({
					path: URI.cliente,
					data: body,
				});
				if ((data as TResult<ClienteType>).rowCount > 0) {
					setCliente((data as TResult<ClienteType>).rows[0]);
				}
			} else {
				await dataUpdate({
					path: URI.cliente,
					data: body,
					params: { codigo: cliente?.codigo },
				});
			}
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar el registro', error);
		}
	};

	const handleSubmitWithoutPropagation = (e: any) => {
		handleSubmit(forwardSave)(e);
	};

	const onDelete = async () => {
		handleDelete(async () => {
			try {
				const result = await dataDelete({
					path: URI.cliente,
					params: { codigo: cliente?.codigo },
				});
				console.log(result);
				sweetAlert({
					text: 'Registro eliminado',
					icon: 'success',
				});
			} catch (error) {
				handleError('No se pudo eliminar el registro', error);
			}
		});
	};

	const onPrint = () => {
		console.log('Print:', cliente);
	};

	if (isLoading) return <GridSkeleton />;
	if (isError) return <ErrorLayout error='No se pudo cargar un parámetro' />;

	return (
		<>
			<Box component={'form'} onSubmit={handleSubmitWithoutPropagation}>
				<Card
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						gap: 2,
						padding: 2,
					}}>
					<Typography variant='h6' component='h2'>
						Formulario cliente
					</Typography>
					<Box sx={gridStyle}>
						<Controller
							name='nombre'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Nombre'
									error={!!errors.nombre}
									helperText={
										errors.nombre
											? errors.nombre?.message
											: ''
									}
								/>
							)}
						/>
						<Controller
							name='nit'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Nit'
									error={!!errors.nit}
									helperText={
										errors.nit ? errors.nit?.message : ''
									}
								/>
							)}
						/>
						<Controller
							name='nombre_c'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Nombre de compañía'
									error={!!errors.nombre_c}
									helperText={
										errors.nombre_c
											? errors.nombre_c?.message
											: ''
									}
								/>
							)}
						/>
						<Controller
							name='nit_factura'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Nit de compañia'
									error={!!errors.nit_factura}
									helperText={
										errors.nit_factura
											? errors.nit_factura?.message
											: ''
									}
								/>
							)}
						/>
					</Box>
					<Box sx={gridStyle}>
						<Controller
							name='direccion'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Direccion'
									error={!!errors.direccion}
									helperText={
										errors.direccion
											? errors.direccion?.message
											: ''
									}
								/>
							)}
						/>
						<Controller
							name='direccion_factura'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Direccion de factura'
									error={!!errors.direccion_factura}
									helperText={
										errors.direccion_factura
											? errors.direccion_factura?.message
											: ''
									}
								/>
							)}
						/>
					</Box>
					<Box sx={gridStyle}>
						<MiAutocomplete
							control={control as any}
							name='pais_origen'
							options={countries.rows.map((item: PaisType) => ({
								id: item.codigo,
								label: item.nombre,
							}))}
							placeholder='Pais de origen'
						/>
						<Controller
							name='dpi'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='DPI'
									error={!!errors.dpi}
									helperText={
										errors.dpi ? errors.dpi?.message : ''
									}
								/>
							)}
						/>
						<Controller
							name='no_pasaporte'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Pasaporte'
									error={!!errors.no_pasaporte}
									helperText={
										errors.no_pasaporte
											? errors.no_pasaporte?.message
											: ''
									}
								/>
							)}
						/>
						<Controller
							name='cedula'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='No. Cédula'
									error={!!errors.cedula}
									helperText={
										errors.cedula
											? errors.cedula?.message
											: ''
									}
								/>
							)}
						/>
					</Box>
					<Box sx={gridStyle}>
						<Controller
							name='telefono_celular'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Teléfono celular'
									error={!!errors.telefono_celular}
									helperText={
										errors.telefono_celular
											? errors.telefono_celular?.message
											: ''
									}
								/>
							)}
						/>
						<Controller
							name='telefono_casa'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Teléfono de casa'
									error={!!errors.telefono_casa}
									helperText={
										errors.telefono_casa
											? errors.telefono_casa?.message
											: ''
									}
								/>
							)}
						/>
					</Box>
					<FormActions
						isNew={cliente?.codigo !== undefined}
						onBack={onClose}
						onDelete={onDelete}
						onPrint={onPrint}
					/>
				</Card>
			</Box>
		</>
	);
};

export default FormCliente;
