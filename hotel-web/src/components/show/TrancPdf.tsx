import { useContext } from 'react';
import { TransactContext } from '../../contexts/TransactProvider';
import { DesTranPdf, SeccionPdf, TituloPdf } from './Components';
import { TranEncabezadoType } from '../../props/ReservaProps';

type TrancPdfProps = {
	tranEnc: TranEncabezadoType;
};

const TrancPdf = ({ tranEnc }: TrancPdfProps) => {
	const { state } = useContext(TransactContext);
	console.log(tranEnc);

	return (
		<>
			<SeccionPdf>
				<TituloPdf
					title='Check in'
					description='Vista previa de check in'
				/>
			</SeccionPdf>
			<SeccionPdf>
				<DesTranPdf
					headers={[
						'DOCUMENTO',
						'FECHA INGRESO',
						'HORA INGRESO',
						'FECHA SALIDA',
						'HORA SALIDA',
					]}
					rows={[
						`${state.tranCorrelativo.tipo_transaccion}-${
							state.tranCorrelativo.serie || ''
						}${state.tranCorrelativo.siguiente || ''}`,
						new Date().toLocaleDateString(),
						new Date().toLocaleTimeString(),
						new Date().toLocaleDateString(),
						new Date().toLocaleTimeString(),
					]}
				/>
				<div className='grid grid-cols-4 grid-rows-3'>
					<p className='w-fit'>Nombre:</p>
					<p className='font-bold'>
						{state.tranEncabezado.nombre_factura}
					</p>
					<p className='w-fit'>Nit:</p>
					<p className='font-bold'>
						{state.tranEncabezado.nit_factura}
					</p>
					<p className='w-fit'>Dirección:</p>
					<p className='font-bold'>
						{state.tranEncabezado.direccion_factura}
					</p>
					<p className='w-fit'>Tipo de cambio</p>
					<p className='font-bold'>{1}</p>
				</div>
				<div className='flex flex-row justify-between'>
					<p>
						No. Personas: <strong>{tranEnc.numero_personas}</strong>
					</p>
					<p>
						Total:{' '}
						<strong>
							{new Intl.NumberFormat('es-GT', {
								style: 'currency',
								currency: 'GTQ',
							}).format(
								tranEnc?.total || state.tranEncabezado.total
							)}
						</strong>
					</p>
					<p>
						IVA:{' '}
						<strong>
							{state.tranEncabezado.iva || tranEnc.iva}
						</strong>
					</p>
					<p>
						INGUAT:{' '}
						<strong>
							{state.tranEncabezado.inguat || tranEnc.inguat}
						</strong>
					</p>
					<p>
						SALDO:{' '}
						<strong>
							{new Intl.NumberFormat('es-GT', {
								style: 'currency',
								currency: 'GTQ',
							}).format(
								tranEnc.total -
									state.rcDetalle.reduce(
										(total, item) =>
											+total +
											Number(
												`${item.monto}`
													.replace('Q. ', '')
													.replace('Q', '')
													.replace(',', '')
											),
										0
									) || tranEnc.saldo
							)}
						</strong>
					</p>
				</div>
			</SeccionPdf>
			<SeccionPdf>
				<table className='table-auto w-full'>
					<thead>
						<tr className='border-y-4 border-black'>
							<th align='left'>DESCRIPCION</th>
							<th align='right'>SERVICIO</th>
							<th align='right'>PRECIO</th>
							<th align='right'>CANTIDAD</th>
							<th align='right'>SUBTOTAL</th>
						</tr>
					</thead>
					<tbody>
						{state.tranDetalle.map((item, index) => (
							<tr key={index}>
								<td align='left'>{item.descripcion}</td>
								<td align='right'>{item.servicio}</td>
								<td align='right'>
									{new Intl.NumberFormat('es-GT', {
										style: 'currency',
										currency: 'GTQ',
									}).format(
										+`${item.precio}`
											.replace('Q.', '')
											.replace('Q', '')
											.replace(',', '')
									)}
								</td>
								<td align='right'>{item.cantidad}</td>
								<td align='right'>
									{new Intl.NumberFormat('es-GT', {
										style: 'currency',
										currency: 'GTQ',
									}).format(
										+`${item.subtotal}`
											.replace('Q. ', '')
											.replace('Q', '')
											.replace(',', '')
									)}
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr className='border-y-4 border-black'>
							<td colSpan={4} align='right'>
								<b>TOTAL:</b>
							</td>
							<td align='right'>
								<b>
									{new Intl.NumberFormat('es-GT', {
										style: 'currency',
										currency: 'GTQ',
									}).format(
										+`${state.tranDetalle
											.reduce(
												(total, item) =>
													+total +
													Number(
														`${item.subtotal}`
															.replace('Q. ', '')
															.replace('Q', '')
															.replace(',', '')
													),
												0
											)
											.toString()}`
									)}
								</b>
							</td>
						</tr>
					</tfoot>
				</table>
			</SeccionPdf>
		</>
	);
};

export default TrancPdf;
