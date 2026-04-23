import { AuthContext } from '../../contexts/AuthProvider';
import { Box, Button } from '@mui/material';
import {
	ChangeEvent,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import { Content } from '../../components/card/Content';
import FormReserva from '../../components/form/FormReserva';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import MiModal from '../../components/show/MiModal';
import PagosPdf from '../../components/show/PagosPdf';
import MiTabla from '../../components/show/Table';
import { ToolbarOnlyRead } from '../../components/show/Toolbar';
import { BASE_URL, URI } from '../../consts/Uri';
import { TransactContext } from '../../contexts/TransactProvider';
import { dataDefault, dataReducer, dataType } from '../../hooks/dataReducer';
import { transactTypes } from '../../hooks/transactReducer';
import { useFetch } from '../../hooks/useFetch';
import {
	dataDelete,
	dataGet,
	downloadFile,
} from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { formatDateTime } from '../../utils/Formateo';
import { handleError } from '../../utils/HandleError';
import { PictureAsPdf, Print } from '@mui/icons-material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import swal from 'sweetalert';

export type CheckInType = {
	stateTran: 0 | 1;
};

const CheckIn = ({ stateTran }: CheckInType) => {
	const { dispatch: tranDispatch } = useContext(TransactContext);
	const { state: authState } = useContext(AuthContext);
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pagosData, setPagosData] = useState<{ checkin: any; pagos: any[] } | null>(null);
	const [openPagosModal, setOpenPagosModal] = useState(false);

	const { data: empresaData } = useFetch({ path: `${URI.empresa}/get`, table: 'empresa' });

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.transaccion}/all`,
		table: 'v_transaccion',
		pageNumber: state.currentPage,
		pageSize: state.limit,
		query: { tipo_transaccion: 'CI', estado: stateTran },
		sort: { serie: 'ASC' },
		q: state.q,
	});

	const handleChange = (event: ChangeEvent<unknown>, p: number) => {
		event.preventDefault();
		dispatch({
			type: dataType.SET_CURRENT_PAGE,
			payload: p,
		});
	};

	const onClose = () => {
		setOpenModal(false);
		tranDispatch({ type: transactTypes.RESET });
		refetch();
	};

	const onEdit = async (checkin: any, index: number) => {
		const { data } = await dataGet({
			path: `${URI.transaccion}/documento`,
			params: {
				serie: checkin.serie,
				documento: checkin.documento,
				tipo_transaccion: checkin.tipo_transaccion,
			},
		});
		tranDispatch({
			type: transactTypes.SET_TRAN_DATA,
			payload: {
				...data,
				operacion: 'CI',
				mode: stateTran ? 'READ' : 'UPDATE',
			},
		});
		setOpenModal(true);
	};

	const onDelete = async (item: any, index: number) => {
		if (stateTran)
			return swal(
				'No se puede eliminar',
				'El check-out no se puede eliminar desde aquí porque ya fue realizado en el sistema de facturación',
				'warning'
			);
		try {
			setLoading(true);
			let result = await dataDelete({
				path: `${URI.transaccion}`,
				params: {
					action: 'D',
					serie: item.serie,
					tipo_transaccion: item.tipo_transaccion,
					documento: item.documento,
				},
				headers: {
					'fecha-operation': item.fecha,
				},
			});
			swal({
				title: 'Registro eliminado',
				text: `El check-in ${item.serie}-${item.documento} ha sido eliminado`,
				icon: 'success',
				timer: 3000,
			});
			refetch();
		} catch (error) {
			handleError('No se pudo eliminar el registro', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'check-in',
				table: 'v_reporte_transaccion',
				columns: {
					documento: 'DOCUMENTO',
					n_habitacion: 'HAB.',
					n_cliente: 'CLIENTE',
					numero_personas: 'PERSONAS',
					fecha_ingreso: 'INGRESO',
					fecha_salida: 'SALIDA',
					subtotal: 'SUBTOTAL',
					saldo: 'SALDO',
					total: 'TOTAL',
				},
				sort: {
					serie: 'ASC',
					tipo_transaccion: 'ASC',
					documento: 'ASC',
				},
				where: { tipo_transaccion: 'CI', estado: stateTran },
				sumatoria: {
					subtotal: 'SUBTOTAL',
					saldo: 'SALDO',
					total: 'TOTAL',
				},
			});
			downloadFileByBloodPart(data, 'CheckIn');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = async (checkin: any) => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'check-in',
				table: 'v_tran_detalle',
				columns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo',
					documento: 'Documento',
					codigo: 'Documento',
					habitacion: 'Habitacion',
					et_subtotal: 'Base sin IVA',
					total: 'Total',
					saldo: 'Saldo',
					fecha_ingreso: 'Fecha ingreso',
					fecha_salida: 'Fecha salida',
					numero_personas: 'Personas',
					nombre_factura: 'Cliente',
					v_nombre: 'Vendedor',
					fecha: 'Fecha',
					descripcion: 'Descripción',
					n_servicio: 'Servicio',
					cantidad: 'Cantidad',
					precio: 'Precio',
					dt_subtotal: 'Subtotal',
				},
				masterColumns: {
					codigo: 'Documento',
					habitacion: 'Habitacion',
					et_subtotal: 'Base sin IVA',
					total: 'Total',
					saldo: 'Saldo',
					fecha_ingreso: 'Fecha ingreso',
					fecha_salida: 'Fecha salida',
				},
				detailColumns: {
					fecha: 'Fecha',
					descripcion: 'Descripción',
					n_servicio: 'Servicio',
					cantidad: 'Cantidad',
					precio: 'Precio',
					dt_subtotal: 'Subtotal',
				},
				sort: {
					serie: 'ASC',
					tipo_transaccion: 'ASC',
					documento: 'ASC',
				},
				where: {
					tipo_transaccion: 'CI',
					serie: checkin.serie,
					documento: checkin.documento,
				},
				sumatoria: { dt_subtotal: 'Subtotal' },
			});
			downloadFileByBloodPart(data, 'CheckIn');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onPagos = async (checkin: any) => {
		try {
			setLoading(true);
			const { data: pagos } = await dataGet({
				path: `${URI.recibo}/porcheckin`,
				params: {
					serie: checkin.serie,
					tipo_transaccion: checkin.tipo_transaccion,
					documento: checkin.documento,
				},
			});
			setPagosData({ checkin, pagos });
			setOpenPagosModal(true);
		} catch (error) {
			handleError('No se pudieron cargar los pagos', error);
		} finally {
			setLoading(false);
		}
	};

	const handlePrintPagos = () => {
		if (!pagosData) return;
		const { checkin, pagos } = pagosData;
		const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);
		const totalCI = Number(`${checkin.total}`.replace('Q.', '').replace(/,/g, '').trim());
		const saldoPendiente = totalCI - totalPagado;
		const fmtQ = (n: number) =>
			new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n);
		const rows = pagos
			.map(
				p =>
					`<tr><td>${p.n_recibo}</td><td>${p.fecha}</td><td>${p.tipo_pago}</td><td>${p.descripcion}</td><td align="right">${fmtQ(Number(p.monto))}</td></tr>`
			)
			.join('');
		const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
<title>Pagos - ${checkin.tipo_transaccion}-${checkin.serie}-${checkin.documento}</title>
<style>body{font-family:Arial,sans-serif;font-size:12px;padding:20px}
table{width:100%;border-collapse:collapse;margin-top:10px}
th,td{padding:6px 8px}thead tr{border-top:3px solid #000;border-bottom:3px solid #000}
tfoot tr:first-child{border-top:2px solid #000}
.g{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0}p{margin:2px 0}
.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px}</style>
</head><body>
<div class="hdr">
  <img src="${BASE_URL}/archivos/${empresaData?.logo || ''}" style="height:64px" onerror="this.style.display='none'"/>
  <div style="text-align:center">
    <strong style="font-size:14px">${empresaData?.nombre || ''}</strong><br/>
    ${empresaData?.direccion || ''}<br/>
    NIT: ${empresaData?.nit || ''}
  </div>
  <div style="text-align:right;font-size:11px">
    ${new Date().toLocaleDateString('es-GT')}<br/>
    ${new Date().toLocaleTimeString('es-GT')}<br/>
    ${authState?.data?.usuario || ''}
  </div>
</div>
<h2>Estado de cuenta - Pagos realizados</h2>
<h3>Check-In: ${checkin.tipo_transaccion}-${checkin.serie}-${checkin.documento}</h3>
<div class="g">
<p>Documento: <strong>${checkin.tipo_transaccion}-${checkin.serie}-${checkin.documento}</strong></p>
<p>Habitación: <strong>${checkin.habitacion || ''}</strong></p>
<p>Cliente: <strong>${checkin.nombre_factura || ''}</strong></p>
<p>Fecha ingreso: <strong>${checkin.fecha_ingreso}</strong></p>
<p>Fecha salida: <strong>${checkin.fecha_salida}</strong></p>
<p>Total: <strong>${checkin.total}</strong></p>
<p>Saldo: <strong>${checkin.saldo}</strong></p>
</div>
<table>
<thead><tr><th align="left">N° Recibo</th><th align="left">Fecha/Hora</th><th align="left">Tipo pago</th><th align="left">Descripción</th><th align="right">Monto</th></tr></thead>
<tbody>${rows || '<tr><td colspan="5" align="center">Sin pagos registrados</td></tr>'}</tbody>
<tfoot>
<tr><td colspan="4" align="right"><strong>TOTAL PAGADO:</strong></td><td align="right"><strong>${fmtQ(totalPagado)}</strong></td></tr>
<tr><td colspan="4" align="right"><strong>SALDO PENDIENTE:</strong></td><td align="right"><strong>${fmtQ(saldoPendiente)}</strong></td></tr>
</tfoot>
</table>
<script>window.onload=()=>window.print();</script>
</body></html>`;
		const w = window.open('', '_blank', 'width=800,height=600');
		if (!w) return;
		w.document.write(html);
		w.document.close();
	};

	const handleDownloadPdf = async () => {
		if (!pagosData) return;
		const { data: empresa } = await dataGet({ path: URI.empresa });
		const { checkin, pagos } = pagosData;
		const fmtQ = (n: number) =>
			new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n);
		const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);
		const totalCI = Number(`${checkin.total}`.replace('Q.', '').replace(/,/g, '').trim());
		const saldoPendiente = totalCI - totalPagado;

		const doc = new jsPDF();

		let logoBase64: string | null = null;
		if (empresa?.logo) {
			try {
				const res = await fetch(`${BASE_URL}/archivos/${empresa.logo}`);
				const blob = await res.blob();
				logoBase64 = await new Promise<string | null>((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result as string);
					reader.onerror = () => resolve(null);
					reader.readAsDataURL(blob);
				});
			} catch { /* continuar sin logo */ }
		}
		const imgFormat = empresa?.logo?.split('.').pop()?.toUpperCase() === 'PNG' ? 'PNG' : 'JPEG';
		if (logoBase64) doc.addImage(logoBase64, imgFormat, 14, 8, 20, 20);

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		if (empresa?.nombre) doc.text(empresa.nombre, 105, 12, { align: 'center' });
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(9);
		if (empresa?.direccion) doc.text(empresa.direccion, 105, 18, { align: 'center' });
		if (empresa?.nit) doc.text(`NIT: ${empresa.nit}`, 105, 24, { align: 'center' });
		doc.text(new Date().toLocaleDateString('es-GT'), 195, 12, { align: 'right' });
		doc.text(new Date().toLocaleTimeString('es-GT'), 195, 18, { align: 'right' });
		if (authState?.data?.usuario) doc.text(authState.data.usuario, 195, 24, { align: 'right' });

		doc.setFontSize(14);
		doc.setFont('helvetica', 'bold');
		doc.text('Estado de cuenta - Pagos realizados', 14, 34);
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(10);
		doc.text(`Check-In: ${checkin.tipo_transaccion}-${checkin.serie}-${checkin.documento}`, 14, 42);

		doc.setFontSize(9);
		doc.text(`Habitación: ${checkin.habitacion || ''}`, 14, 52);
		doc.text(`Cliente: ${checkin.nombre_factura || ''}`, 110, 52);
		doc.text(`Fecha ingreso: ${checkin.fecha_ingreso}`, 14, 58);
		doc.text(`Fecha salida: ${checkin.fecha_salida}`, 110, 58);
		doc.text(`Total: ${checkin.total}`, 14, 64);
		doc.text(`Saldo: ${checkin.saldo}`, 110, 64);

		autoTable(doc, {
			startY: 70,
			head: [['N° Recibo', 'Fecha/Hora', 'Tipo pago', 'Descripción', 'Monto']],
			body: pagos.length > 0
				? pagos.map(p => [p.n_recibo, p.fecha, p.tipo_pago, p.descripcion, fmtQ(Number(p.monto))])
				: [['', '', '', 'Sin pagos registrados', '']],
			foot: [
				['', '', '', 'TOTAL PAGADO:', fmtQ(totalPagado)],
				['', '', '', 'SALDO PENDIENTE:', fmtQ(saldoPendiente)],
			],
			theme: 'grid',
			headStyles: {
				fillColor: [242, 242, 242],
				textColor: [0, 0, 0],
				fontStyle: 'bold',
				lineColor: [0, 0, 0],
				lineWidth: 0.3,
			},
			bodyStyles: {
				lineColor: [200, 200, 200],
				lineWidth: 0.1,
			},
			footStyles: {
				fontStyle: 'bold',
				fillColor: [255, 255, 255],
				textColor: [0, 0, 0],
				lineWidth: 0.3,
				lineColor: [0, 0, 0],
			},
			columnStyles: { 4: { halign: 'right' } },
		});

		doc.save(`Pagos-CI-${checkin.serie}-${checkin.documento}.pdf`);
	};

	useEffect(() => {
		if (data) {
			const rows = (data.rows ?? []).map((row: any) => {
				const raw = row.fecha_ingreso_completa;
				if (!raw) return row;
				const parsed = new Date(raw);
				return {
					...row,
					fecha_ingreso: isNaN(parsed.getTime())
						? row.fecha_ingreso
						: formatDateTime(parsed),
				};
			});
			dispatch({
				type: dataType.SET_METADATA,
				payload: { ...data, rows },
			});
		}
	}, [data]);

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<ToolbarOnlyRead
					title={stateTran ? 'Check-out' : 'Check-in'}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
					onDownload={onDownload}
				/>
				<Box sx={{ mt: 2 }}>
					<MiTabla
						headers={{
							serie: 'Serie',
							documento: 'Documento',
							habitacion: 'Habitacion',
							fecha_ingreso: 'Fecha Ingreso',
							subtotal: 'Subtotal',
							saldo: 'Saldo',
							total: 'Total',
						}}
						rows={state?.data || []}
						sumatoria=''
						onEdit={onEdit}
						onDelete={onDelete}
						onDownload={onDownloadOne}
						onPayments={onPagos}
					/>
					<Paginacion
						count={state.pages}
						page={state.currentPage}
						onChange={handleChange}
					/>
				</Box>
			</Content>
			{loading && <Loader />}
			<MiModal size='large' open={openModal} onClose={onClose}>
				<FormReserva onClose={onClose} />
			</MiModal>
			<MiModal size='large' open={openPagosModal} onClose={() => setOpenPagosModal(false)}>
				{pagosData ? (
					<>
						<Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-end' }}>
							<Button variant='outlined' startIcon={<Print />} onClick={handlePrintPagos}>
								Imprimir
							</Button>
							<Button variant='contained' startIcon={<PictureAsPdf />} onClick={handleDownloadPdf}>
								Descargar PDF
							</Button>
						</Box>
						<PagosPdf checkin={pagosData.checkin} pagos={pagosData.pagos} />
					</>
				) : <></>}
			</MiModal>
		</>
	);
};

export default CheckIn;
