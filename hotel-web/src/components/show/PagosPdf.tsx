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
				<table className='table-auto w-full text-sm border border-collapse border-gray-300'>
					<tbody>
						<tr>
							<td className='border border-gray-300 px-2 py-1 font-bold bg-gray-50 w-1/4'>Documento</td>
							<td className='border border-gray-300 px-2 py-1 w-1/4'>{`${checkin.tipo_transaccion}-${checkin.serie}-${checkin.documento}`}</td>
							<td className='border border-gray-300 px-2 py-1 font-bold bg-gray-50 w-1/4'>Habitación</td>
							<td className='border border-gray-300 px-2 py-1 w-1/4'>{checkin.habitacion || ''}</td>
						</tr>
						<tr>
							<td className='border border-gray-300 px-2 py-1 font-bold bg-gray-50'>Cliente</td>
							<td className='border border-gray-300 px-2 py-1'>{checkin.nombre_factura || ''}</td>
							<td className='border border-gray-300 px-2 py-1 font-bold bg-gray-50'>Fecha ingreso</td>
							<td className='border border-gray-300 px-2 py-1'>{checkin.fecha_ingreso}</td>
						</tr>
						<tr>
							<td className='border border-gray-300 px-2 py-1 font-bold bg-gray-50'>Fecha salida</td>
							<td className='border border-gray-300 px-2 py-1'>{checkin.fecha_salida}</td>
							<td className='border border-gray-300 px-2 py-1 font-bold bg-gray-50'>Total</td>
							<td className='border border-gray-300 px-2 py-1'>{checkin.total}</td>
						</tr>
						<tr>
							<td className='border border-gray-300 px-2 py-1 font-bold bg-gray-50'>Saldo</td>
							<td className='border border-gray-300 px-2 py-1'>{checkin.saldo}</td>
							<td className='border border-gray-300 px-2 py-1 bg-gray-50' colSpan={2}></td>
						</tr>
					</tbody>
				</table>
			</SeccionPdf>
			<SeccionPdf>
				<table className='table-auto w-full border border-collapse border-gray-300'>
					<thead>
						<tr>
							<th className='bg-blue-700 text-white font-bold text-left px-2 py-1.5'>N° Recibo</th>
							<th className='bg-blue-700 text-white font-bold text-left px-2 py-1.5'>Fecha/Hora</th>
							<th className='bg-blue-700 text-white font-bold text-left px-2 py-1.5'>Tipo pago</th>
							<th className='bg-blue-700 text-white font-bold text-left px-2 py-1.5'>Descripción</th>
							<th className='bg-blue-700 text-white font-bold text-right px-2 py-1.5'>Monto</th>
						</tr>
					</thead>
					<tbody>
						{pagos.length === 0 ? (
							<tr>
								<td colSpan={5} className='px-2 py-1.5 text-center border-b border-gray-200'>
									Sin pagos registrados
								</td>
							</tr>
						) : (
							pagos.map((p, i) => (
								<tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
									<td className='px-2 py-1.5 border-b border-gray-200'>{p.n_recibo}</td>
									<td className='px-2 py-1.5 border-b border-gray-200'>{p.fecha}</td>
									<td className='px-2 py-1.5 border-b border-gray-200'>{p.tipo_pago}</td>
									<td className='px-2 py-1.5 border-b border-gray-200'>{p.descripcion}</td>
									<td className='px-2 py-1.5 border-b border-gray-200 text-right'>{formatQ(Number(p.monto))}</td>
								</tr>
							))
						)}
					</tbody>
					<tfoot>
						<tr className='border-t-2 border-gray-400'>
							<td colSpan={4} className='px-2 py-1.5 text-right font-bold'>TOTAL PAGADO:</td>
							<td className='px-2 py-1.5 text-right font-bold'>{formatQ(totalPagado)}</td>
						</tr>
						<tr>
							<td colSpan={4} className='px-2 py-1.5 text-right font-bold'>SALDO PENDIENTE:</td>
							<td className='px-2 py-1.5 text-right font-bold'>{formatQ(saldoPendiente)}</td>
						</tr>
					</tfoot>
				</table>
			</SeccionPdf>
		</>
	);
};

export default PagosPdf;
