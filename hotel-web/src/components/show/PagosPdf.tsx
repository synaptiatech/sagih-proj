import { SeccionPdf, TituloPdf } from './Components';

type PagoType = {
	codigo: number;
	n_recibo: string;
	fecha: string;
	tipo_pago: string;
	descripcion: string;
	monto: number;
};

type CheckInInfo = {
	serie: string;
	tipo_transaccion: string;
	documento: number;
	habitacion?: string;
	nombre_factura?: string;
	fecha_ingreso: string;
	fecha_salida: string;
	total: string;
	saldo: string;
};

type PagosPdfProps = {
	checkin: CheckInInfo;
	pagos: PagoType[];
};

const formatQ = (n: number) =>
	new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n);

const PagosPdf = ({ checkin, pagos }: PagosPdfProps) => {
	const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);
	const totalCI = Number(
		`${checkin.total}`.replace('Q.', '').replace(/,/g, '').trim()
	);
	const saldoPendiente = totalCI - totalPagado;

	return (
		<>
			<SeccionPdf>
				<TituloPdf
					title='Estado de cuenta - Pagos realizados'
					description={`Check-In: ${checkin.tipo_transaccion}-${checkin.serie}-${checkin.documento}`}
				/>
			</SeccionPdf>
			<SeccionPdf>
				<div className='grid grid-cols-2 gap-2 py-2'>
					<p>
						Documento:{' '}
						<strong>{`${checkin.tipo_transaccion}-${checkin.serie}-${checkin.documento}`}</strong>
					</p>
					<p>
						Habitación: <strong>{checkin.habitacion || ''}</strong>
					</p>
					<p>
						Cliente: <strong>{checkin.nombre_factura || ''}</strong>
					</p>
					<p>
						Fecha ingreso: <strong>{checkin.fecha_ingreso}</strong>
					</p>
					<p>
						Fecha salida: <strong>{checkin.fecha_salida}</strong>
					</p>
					<p>
						Total: <strong>{checkin.total}</strong>
					</p>
					<p>
						Saldo: <strong>{checkin.saldo}</strong>
					</p>
				</div>
			</SeccionPdf>
			<SeccionPdf>
				<table className='table-auto w-full'>
					<thead>
						<tr className='border-y-4 border-black'>
							<th align='left'>N° Recibo</th>
							<th align='left'>Fecha/Hora</th>
							<th align='left'>Tipo pago</th>
							<th align='left'>Descripción</th>
							<th align='right'>Monto</th>
						</tr>
					</thead>
					<tbody>
						{pagos.length === 0 ? (
							<tr>
								<td colSpan={5} align='center'>
									Sin pagos registrados
								</td>
							</tr>
						) : (
							pagos.map((p, i) => (
								<tr key={i}>
									<td align='left'>{p.n_recibo}</td>
									<td align='left'>{p.fecha}</td>
									<td align='left'>{p.tipo_pago}</td>
									<td align='left'>{p.descripcion}</td>
									<td align='right'>{formatQ(Number(p.monto))}</td>
								</tr>
							))
						)}
					</tbody>
					<tfoot>
						<tr className='border-t-2 border-black'>
							<td colSpan={4} align='right'>
								<b>TOTAL PAGADO:</b>
							</td>
							<td align='right'>
								<b>{formatQ(totalPagado)}</b>
							</td>
						</tr>
						<tr>
							<td colSpan={4} align='right'>
								<b>SALDO PENDIENTE:</b>
							</td>
							<td align='right'>
								<b>{formatQ(saldoPendiente)}</b>
							</td>
						</tr>
					</tfoot>
				</table>
			</SeccionPdf>
		</>
	);
};

export default PagosPdf;
