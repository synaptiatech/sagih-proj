import { Box, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Content } from '../../components/card/Content';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import { MiBar } from '../../components/reportes/MiBar';
import { MiLine } from '../../components/reportes/MiLine';
import { MiRadar } from '../../components/reportes/MiRadar';
import { MiRadial } from '../../components/reportes/MiRadial';
import { getRandomHEXColor } from '../../components/reportes/utils/randomColor';
import { ToolbarOnlyRead } from '../../components/show/Toolbar';
import { URI } from '../../consts/Uri';
import { useFetch } from '../../hooks/useFetch';
import { formatDateToInput } from '../../utils/Formateo';

const Gerencial = () => {
	const [mes, setMes] = useState(
		formatDateToInput({
			date: new Date(),
			onlyMonth: true,
		})
	);
	const { data, isLoading, isError } = useFetch({
		path: `${URI.reporte}/gerenciales`,
		table: 'servicio',
		columns: {},
		query: { fecha: mes },
	});
	const {
		data: rep1,
		isLoading: loadRep1,
		isError: errRep1,
	} = useFetch({
		path: `${URI.reporte}/hab-dia`,
		table: 'servicio',
		columns: {},
		query: { fecha: mes },
	});
	const {
		data: rep2,
		isLoading: loadRep2,
		isError: errRep2,
	} = useFetch({
		path: `${URI.reporte}/checkin-por-tipo`,
		table: 'servicio',
		columns: {},
		query: { fecha: mes },
	});
	const {
		data: rep3,
		isLoading: loadRep3,
		isError: errRep3,
	} = useFetch({
		path: `${URI.reporte}/ingresos`,
		table: 'servicio',
		columns: {},
		query: { fecha: mes },
	});
	const {
		data: rep4,
		isLoading: loadRep4,
		isError: errRep4,
	} = useFetch({
		path: `${URI.reporte}/avg_estance`,
		table: 'servicio',
		columns: {},
		query: { fecha: mes },
	});
	const {
		data: rep5,
		isLoading: loadRep5,
		isError: errRep5,
	} = useFetch({
		path: `${URI.reporte}/sales_vendedor`,
		table: 'servicio',
		columns: {},
		query: { fecha: mes },
	});

	if (isLoading) return <Loader />;
	if (isError)
		return <ErrorLayout error='No se pudo obtener algunos datos' />;

	return (
		<>
			<Content>
				<ToolbarOnlyRead title='Reporte Gerencial' />
				<TextField
					variant='standard'
					onChange={(e) => setMes(e.target.value)}
					value={mes}
					label='Mes'
					type='month'
					InputLabelProps={{
						shrink: true,
					}}
				/>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-around',
						flexWrap: 'wrap',
					}}>
					<Box sx={{ mt: 3 }}>
						<Typography variant='h5'>
							Ocupación de habitaciones por día
						</Typography>
						<MiLine
							size={{ width: 400, height: 250 }}
							data={rep1 || []}
							dataKey={{
								x: { label: 'Días', xKey: 'dia' },
								y: {
									label: 'No. Ocupadas',
									yKeys: ['ocupada'],
								},
							}}
						/>
						T
					</Box>
					<Box sx={{ mt: 3 }}>
						<Typography variant='h5'>
							Check-in por tipo de habitación
						</Typography>
						<MiRadar
							size={{ width: 400, height: 250 }}
							data={rep2 || []}
							dataKey={{
								xKey: 'nombre',
								yKeys: 'uso',
							}}
							name='Uso'
						/>
					</Box>
					<Box sx={{ mt: 3 }}>
						<Typography variant='h5'>
							Tiempo promedio de estancia
						</Typography>
						<MiLine
							size={{ width: 400, height: 250 }}
							data={rep4 || []}
							dataKey={{
								x: { label: 'Días', xKey: 'dia' },
								y: {
									label: 'Promedio en días',
									yKeys: ['promedio'],
								},
							}}
						/>
					</Box>
					<Box sx={{ mt: 3 }}>
						<Typography variant='h5'>Ingresos por mes</Typography>
						<MiLine
							size={{ width: 400, height: 250 }}
							data={rep3 || []}
							dataKey={{
								x: { label: 'Días', xKey: 'dia' },
								y: {
									label: 'Ingresos Q.',
									yKeys: ['ingresos'],
								},
							}}
						/>
					</Box>
					<Box sx={{ mt: 3 }}>
						<Typography variant='h5'>
							Ventas por vendedor
						</Typography>
						<MiBar
							size={{ width: 400, height: 250 }}
							data={rep5 || []}
							dataKey={{
								x: { label: 'Vendedor', xKey: 'nombre' },
								y: { label: 'No. ventas', yKeys: ['ventas'] },
							}}
						/>
					</Box>
					<Box sx={{ mt: 3 }}>
						<Typography variant='h5'>Servicios vendidos</Typography>
						<MiRadial
							data={data.barras.map(
								(item: {
									nombre: string;
									vendidos: number;
								}) => ({
									name: item.nombre,
									dataKey: item.vendidos,
									fill: getRandomHEXColor(),
								})
							)}
						/>
						{/* <MiBar
							size={{ width: 400, height: 250 }}
							data={data.barras || []}
							dataKey={{
								x: { label: 'Servicios', xKey: 'nombre' },
								y: { label: 'No. ventas', yKeys: ['vendidos'] },
							}}
						/> */}
					</Box>
					<Box sx={{ mt: 3 }}>
						<Typography variant='h5'>Check-in por día</Typography>
						<MiBar
							size={{ width: 400, height: 250 }}
							data={data.lineas || []}
							dataKey={{
								x: { label: 'Días', xKey: 'fecha' },
								y: { label: 'No. ingresos', yKeys: ['conteo'] },
							}}
						/>
					</Box>
					<Box sx={{ mt: 3 }}>
						<Typography variant='h5'>
							Servicios por reservas
						</Typography>
						<MiBar
							size={{ width: 400, height: 250 }}
							data={data.lineas || []}
							dataKey={{
								x: { label: 'Servicios', xKey: 'nombre' },
								y: {
									label: 'No. servicios',
									yKeys: ['conteo'],
								},
							}}
						/>
					</Box>
				</Box>
			</Content>
		</>
	);
};

export default Gerencial;
