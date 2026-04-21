import { Delete, Edit, Print, SecurityRounded } from '@mui/icons-material';
import {
	Box,
	Card,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableRow,
	Tooltip,
} from '@mui/material';
import { MiTablaProps } from '../../props/ShowProps';
import { formatDate, formatearEstadoHabitacion } from '../../utils/Formateo';
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';

const isNumeric = (n: string) => !!Number(n);

const cellAlign = (key: string, value: any) => {
	if (
		key.includes('documento') ||
		key.includes('precio') ||
		key.includes('subtotal') ||
		key.includes('total') ||
		key.includes('costo') ||
		key.includes('saldo') ||
		key.includes('monto') ||
		key.includes('cantidad') ||
		key.includes('existencia') ||
		key.includes('stock') ||
		key.includes('cantidad') ||
		key.includes('abono') ||
		key.includes('nit') ||
		key.includes('siguiente') ||
		key.includes('iva')
	)
		return 'right';
	return isNumeric(value) ? 'right' : 'left';
};

/**
 * Formatear celdas de a cuerdo al contenido
 * @param key Clave de la celda
 * @param value Valor de la celda
 * @returns Valor formateado
 */
const formatearCeldas = (key: string, value: string) => {
	if (key.toLowerCase().includes('fecha')) {
		if (value.includes('T')) {
			return formatDate(new Date(value));
		}
	} else if (
		key.toLocaleLowerCase().includes('monto') ||
		key.toLocaleLowerCase().includes('total') ||
		key.toLocaleLowerCase().includes('subtotal') ||
		key.toLocaleLowerCase().includes('precio') ||
		key.toLocaleLowerCase().includes('costo') ||
		key.toLocaleLowerCase().includes('saldo') ||
		key.toLocaleLowerCase().includes('abono')
	) {
		if (value.includes('Q.'))
			return new Intl.NumberFormat('es-GT', {
				style: 'currency',
				currency: 'GTQ',
			}).format(+value.replace('Q.', '').replace(',', ''));
		return new Intl.NumberFormat('es-GT', {
			style: 'currency',
			currency: 'GTQ',
		}).format(+value);
	} else if (key.toLocaleLowerCase().includes('estado')) {
		return formatearEstadoHabitacion(value);
	}
	return value;
};

const Headers = ({ headers }: { headers: Object }) => {
	return (
		<TableHead>
			<TableRow>
				{Object.entries(headers).map(([key, value]) => (
					<TableCell key={key} align={cellAlign(key, '')}>
						{value}
					</TableCell>
				))}
				<TableCell>Acciones</TableCell>
			</TableRow>
		</TableHead>
	);
};

const MiTabla = ({
	rows,
	headers,
	sumatoria,
	onPermission = undefined,
	onDelete = undefined,
	onDownload = undefined,
	onEdit = undefined,
	cellRenderer = undefined,
}: MiTablaProps) => {
	const headersKey: string[] = Object.keys(headers);
	const headersValue: Object[] = Object.values(headers);

	if (!rows || rows.length === 0) {
		return (
			<Card>
				<Box
					sx={{
						minWidth: '100%',
						overflowX: 'scroll',
						scrollbarWidth: 'none',
					}}
					className='no-scrollbar'>
					<Table sx={{ minWidth: 650 }}>
						<Headers headers={headers} />
						<TableBody>
							<TableRow>
								<TableCell
									colSpan={headersKey.length + 1}
									sx={{ textAlign: 'center' }}>
									No hay datos
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Box>
			</Card>
		);
	}

	return (
		<Card>
			<>
				<Box
					sx={{
						minWidth: '100%',
						overflowX: 'scroll',
						scrollbarWidth: 'none',
					}}
					className='no-scrollbar'>
					<Table sx={{ minWidth: 650 }}>
						<Headers headers={headers} />
						<TableBody>
							{rows.map((row: Object, index: number) => (
								<TableRow key={index}>
									{headersKey.map((key: string) => (
										<TableCell
											sx={{
												textAlign: cellAlign(
													key,
													row[key as keyof typeof row]
												),
											}}
											key={key}
											onClick={() => {
												if (onEdit) onEdit(row, index);
											}}>
											{cellRenderer?.[key]
												? cellRenderer[key](
														row[key as keyof typeof row],
														row
												  )
												: formatearCeldas(
														key,
														row[
															key as keyof typeof row
														]?.toString() || ''
												  )}
										</TableCell>
									))}
									<TableCell>
										{onEdit && (
											<Tooltip title='Editar registro'>
												<IconButton
													color='secondary'
													onClick={() =>
														onEdit(row, index)
													}>
													<Edit />
												</IconButton>
											</Tooltip>
										)}
										{onPermission && (
											<Tooltip title='Modificar permisos'>
												<IconButton
													color='warning'
													onClick={() =>
														onPermission(row)
													}>
													<SecurityRounded />
												</IconButton>
											</Tooltip>
										)}
										{onDelete && (
											<Tooltip title='Eliminar registro'>
												<IconButton
													color='warning'
													onClick={() =>
														onDelete(row, index)
													}>
													<Delete />
												</IconButton>
											</Tooltip>
										)}
										{onDownload && (
											<Tooltip title='Imprimir registro'>
												<IconButton
													color='primary'
													onClick={() =>
														onDownload(row)
													}>
													<Print />
												</IconButton>
											</Tooltip>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						{sumatoria && (
							<TableFooter>
								<TableRow>
									<TableCell
										colSpan={headersKey.length - 1}
										sx={{
											fontWeight: '700',
											fontSize: '1.2rem',
											textAlign: 'right',
										}}>
										TOTAL
									</TableCell>
									<TableCell
										sx={{
											fontWeight: '700',
											fontSize: '1.2rem',
											textAlign: 'right',
										}}>
										{new Intl.NumberFormat('es-GT', {
											style: 'currency',
											currency: 'GTQ',
										}).format(
											rows.reduce(
												(
													accumulator: number,
													currentValue: any
												) =>
													accumulator +
													Number(
														`${currentValue[sumatoria]}`
															.replace('Q.', '')
															.replace(',', '')
													),
												0
											)
										)}
									</TableCell>
								</TableRow>
							</TableFooter>
						)}
					</Table>
				</Box>
			</>
		</Card>
	);
};

export default MiTabla;
