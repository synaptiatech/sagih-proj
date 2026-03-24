import { useContext } from 'react';
import { TransactContext } from '../../contexts/TransactProvider';
import { DesRcPdf, SeccionPdf, TituloPdf } from './Components';

const RcPdf = () => {
	const { state } = useContext(TransactContext);

	return (
		<>
			<SeccionPdf>
				<TituloPdf
					title='Recibo de caja'
					description='Vista previa de recibo de caja'
				/>
			</SeccionPdf>
			<SeccionPdf>
				<DesRcPdf headers={['DOCUMENTO', 'FECHA', 'HORA']} />
				<div className='flex flex-row flex-wrap justify-between py-2'>
					<p>
						Cliente:{' '}
						<strong>
							{state.tranEncabezado.nombre_factura || ''}
						</strong>
					</p>
					<p>
						Dirección:{' '}
						<strong>
							{state.tranEncabezado.direccion_factura || ''}
						</strong>
					</p>
					<p>
						NIT:{' '}
						<strong>
							{state.tranEncabezado.nit_factura || ''}
						</strong>
					</p>
					<p>
						Tipo cambio:{' '}
						<strong>{state.tranEncabezado.tipo_cambio || 1}</strong>
					</p>
				</div>
			</SeccionPdf>
			<SeccionPdf>
				<table className='table-auto w-full'>
					<thead>
						<tr className='border-y-4 border-black'>
							<th align='left'>Documento</th>
							<th align='right'>Fecha</th>
							<th align='right'>Hora</th>
							<th align='left'>Descripción</th>
							<th align='right'>Abono</th>
						</tr>
					</thead>
					<tbody>
						{state.rcDetalle.map((item, index) => (
							<tr key={index}>
								<td align='left'>{`${item.tipo_transaccion}-${item.serie}${item.documento}`}</td>
								<td align='right'>
									{new Date().toLocaleDateString()}
								</td>
								<td align='right'>
									{new Date().toLocaleTimeString()}
								</td>
								<td align='left'>{item.descripcion}</td>
								<td align='right'>
									{new Intl.NumberFormat('es-GT', {
										currency: 'GTQ',
										style: 'currency',
									}).format(
										+`${item.monto}`
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
									{`Q. ${parseFloat(
										state.rcDetalle
											.reduce(
												(total, item) =>
													+total + +item.monto,
												0
											)
											.toString()
									).toFixed(2)}`}
								</b>
							</td>
						</tr>
					</tfoot>
				</table>
			</SeccionPdf>
		</>
	);
};

export default RcPdf;
