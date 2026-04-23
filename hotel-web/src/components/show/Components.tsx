import { Box, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { BASE_URL, URI } from '../../consts/Uri';
import { AuthContext } from '../../contexts/AuthProvider';
import { TransactContext } from '../../contexts/TransactProvider';
import { useFetch } from '../../hooks/useFetch';
import { RCDetType } from '../../props/ReciboProps';
import { formatDate, formatTime } from '../../utils/Formateo';
import GridSkeleton from '../layout/waiting';

const SeccionPdf = ({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) => {
	return (
		<section className='block p-6 bg-white border border-gray-200 rounded-lg shadow my-3'>
			{children}
		</section>
	);
};

const TituloPdf = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	const { state } = useContext(AuthContext);
	const { data, isLoading, isError } = useFetch({
		path: `${URI.empresa}/get`,
		table: 'empresa',
	});

	if (isLoading) return <GridSkeleton />;
	if (isError)
		return (
			<Typography variant='body1'>
				No se encontraron datos de la empresa
			</Typography>
		);

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<Box>
					{data.logo && <img
						src={`${BASE_URL}/archivos/${data.logo}`}
						alt='Logo'
						width={128}
						height={128}
					/>}
				</Box>
				<Box>
					<Typography align='center' variant='h6'>
						{data.nombre}
					</Typography>
					<Typography align='center' variant='body2'>
						{data.direccion}
					</Typography>
					<Typography align='center' variant='body2'>
						{data.nit}
					</Typography>
				</Box>
				<Box>
					<Typography align='right' variant='body2'>
						{formatDate(new Date())}
					</Typography>
					<Typography align='right' variant='body2'>
						{formatTime(new Date())}
					</Typography>
					<Typography align='right' variant='body2'>
						{state.data.usuario}
					</Typography>
				</Box>
			</Box>
			<Box>
				<Typography variant='h6'>{title}</Typography>
				<Typography variant='body1'>{description}</Typography>
			</Box>
		</>
	);
};

const DesTranPdf = ({
	headers,
	rows,
}: {
	headers: String[];
	rows: String[];
}) => {
	return (
		<table className='table-auto border border-collapse border-black w-full'>
			<thead>
				<tr>
					{headers.map((header, index) => (
						<td
							key={index}
							className='border border-black'
							align='center'>
							{header}
						</td>
					))}
				</tr>
			</thead>
			<tbody>
				<tr>
					{rows.map((row, index) => (
						<th key={index} className='border border-black'>
							{row}
						</th>
					))}
				</tr>
			</tbody>
		</table>
	);
};

// TODO: Refactor this component
// TODO: Mejorar la obtención de data de los tipos de pago
const DesRcPdf = ({ headers }: { headers: String[] }) => {
	const { state } = useContext(TransactContext);
	const {
		data: payTypes,
		isLoading,
		isError,
	} = useFetch({
		path: `${URI.general}/all`,
		columns: { codigo: 'Código', nombre: 'Nombre' },
		table: 'tipo_pago',
	});

	/**
	 * @description Group by pay type
	 * @returns { number: { name: string, value: number } }
	 * @example
	 * {
	 * 	1: { name: 'Efectivo', value: 0 },
	 * 	2: { name: 'Tarjeta', value: 0 },
	 * 	3: { name: 'Cheque', value: 0 },
	 * 	4: { name: 'Transferencia', value: 0 },
	 * }
	 */
	const groupByPayType = (): number => {
		const result: any = {};
		payTypes.rows.forEach((item: any) => {
			result[item.codigo] = { name: item.nombre, value: 0 };
			headers.push(`${item.nombre} Q`);
		});
		headers.push('Total Q');
		state.rcDetalle.forEach((item: RCDetType) => {
			result[item.tipo_pago] = {
				...result[item.tipo_pago],
				value: result[item.tipo_pago].value + item.monto,
			};
		});
		return result;
	};

	useEffect(() => {
		if (payTypes && !isLoading) groupByPayType();
	}, [isLoading]);

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error...</p>;

	return (
		<table className='table-auto border border-collapse border-black w-full'>
			<thead>
				<tr>
					{headers.map((header, index) => (
						<td
							key={index}
							className='border border-black'
							align='center'>
							{header}
						</td>
					))}
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>{state.rcDetalle[0]
						? `${state.rcDetalle[0].tipo_transaccion}-${state.rcDetalle[0].serie}${state.rcDetalle[0].documento}`
						: ''}</th>
					<th>{state.rcDetalle[0]?.fecha
						? new Date(state.rcDetalle[0].fecha).toLocaleDateString('es-GT')
						: ''}</th>
					<th>{state.rcDetalle[0]?.fecha
						? new Date(state.rcDetalle[0].fecha).toLocaleTimeString('es-GT')
						: ''}</th>
					{Object.values(groupByPayType()).map((value, index) => (
						<th key={index}>
							{new Intl.NumberFormat('es-GT', {
								currency: 'GTQ',
								style: 'currency',
								notation: 'compact',
							}).format(value.value)}
						</th>
					))}
					<th>
						{new Intl.NumberFormat('es-GT', {
							currency: 'GTQ',
							style: 'currency',
						}).format(
							state.rcDetalle.reduce(
								(total, item) => +total + +item.monto,
								0
							)
						)}
					</th>
				</tr>
			</tbody>
		</table>
	);
};

export { DesRcPdf, DesTranPdf, SeccionPdf, TituloPdf };
