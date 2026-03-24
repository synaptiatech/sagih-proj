import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

const GridSkeleton = React.lazy(() => import('../components/layout/waiting'));
const TransactProvider = React.lazy(
	() => import('../contexts/TransactProvider')
);
const ComprasProvider = React.lazy(() => import('../contexts/ComprasProvider'));
const PerfilProvider = React.lazy(() => import('../contexts/PerfilProvider'));
const Vendedor = React.lazy(() => import('../pages/datos/Vendedor/Vendedor'));
const Correlativo = React.lazy(
	() => import('../pages/parametros/Correlativo/Correlativo')
);
const UserProfile = React.lazy(
	() => import('../pages/UserProfile/UserProfile')
);
const NotFound = React.lazy(() => import('../pages/NotFound'));
const Home = React.lazy(() => import('../pages/personal/Home'));
const Login = React.lazy(() => import('../pages/sesion/Login'));
const Recovery = React.lazy(() => import('../pages/sesion/Recovery'));
const Registro = React.lazy(() => import('../pages/sesion/Registro'));
const Admin = React.lazy(() => import('../pages/personal/Admin'));
// PARAMS
const ImpuestoParams = React.lazy(() => import('../pages/parametros/Impuesto'));
const TipoHabParams = React.lazy(
	() => import('../pages/parametros/TipoHabitacion')
);
const TipoServParams = React.lazy(
	() => import('../pages/parametros/TipoServicio')
);
const AreaParams = React.lazy(() => import('../pages/parametros/Area'));
const NivelParams = React.lazy(() => import('../pages/parametros/Nivel'));
const TipoPagoParams = React.lazy(() => import('../pages/parametros/TipoPago'));
// DATA
const ClienteData = React.lazy(() => import('../pages/datos/Cliente'));
const HabitacionData = React.lazy(() => import('../pages/datos/Habitacion'));
const ServicioData = React.lazy(() => import('../pages/datos/Servicio'));
const DepartamentoData = React.lazy(
	() => import('../pages/datos/Departamento')
);
const PaisData = React.lazy(() => import('../pages/datos/Pais'));
const ProductoData = React.lazy(
	() => import('../pages/parametros/Producto/Producto')
);
// MOVEMENTS
const CheckInMoves = React.lazy(() => import('../pages/movimiento/CheckIn'));
const CompraMoves = React.lazy(() => import('../pages/movimiento/Compra'));
const OrdenMoves = React.lazy(() => import('../pages/movimiento/Order'));
const PagoMoves = React.lazy(() => import('../pages/movimiento/Pago'));
const ReservacionMoves = React.lazy(
	() => import('../pages/movimiento/Reservacion')
);
// PROCESS
const CierreProcess = React.lazy(
	() => import('../pages/proceso/Cierre/Cierre')
);
const SaldosProcess = React.lazy(
	() => import('../pages/proceso/Saldos/Saldos')
);
const StocksProcess = React.lazy(() => import('../pages/proceso/Stock/Stock'));
// REPORTS
const ClienteReport = React.lazy(() => import('../pages/reporte/Cliente'));
const GerencialReport = React.lazy(() => import('../pages/reporte/General'));
const MovimientosReport = React.lazy(
	() => import('../pages/reporte/Movimientos')
);
const ServicioReport = React.lazy(() => import('../pages/reporte/Servicio'));
const Habitacion = React.lazy(() => import('../pages/reporte/Habitacion'));
const Usabilidad = React.lazy(() => import('../pages/reporte/Usabilidad'));
const Ventas = React.lazy(() => import('../pages/reporte/Ventas'));
const VentasCobros = React.lazy(() => import('../pages/reporte/VentasCobros'));
const CierreReport = React.lazy(
	() => import('../pages/proceso/HistoriaCierre/HistoriaCierre')
);
// SECURITY
const CompaniaSecurity = React.lazy(
	() => import('../pages/seguridad/Compania')
);
const PaginaSecurity = React.lazy(() => import('../pages/seguridad/Pagina'));
const PerfilSecurity = React.lazy(() => import('../pages/seguridad/Perfil'));
const UsuariosSecurity = React.lazy(
	() => import('../pages/seguridad/Usuarios')
);
// INVENTARY

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<React.Suspense fallback={<GridSkeleton />}>
				<Login />
			</React.Suspense>
		),
		errorElement: (
			<React.Suspense fallback={<GridSkeleton />}>
				<NotFound />
			</React.Suspense>
		),
	},
	{
		path: '/register',
		element: (
			<React.Suspense fallback={<GridSkeleton />}>
				<Registro />
			</React.Suspense>
		),
	},
	{
		path: '/recovery',
		element: (
			<React.Suspense fallback={<GridSkeleton />}>
				<Recovery />
			</React.Suspense>
		),
	},
	{
		path: '/dashboard',
		element: (
			<React.Suspense fallback={<GridSkeleton />}>
				<Admin />
			</React.Suspense>
		),
		children: [
			// PROFILE
			{
				path: 'perfil',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TransactProvider>
							<UserProfile />
						</TransactProvider>
					</React.Suspense>
				),
			},
			// INICIO
			{
				path: 'inicio',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TransactProvider>
							<Home />
						</TransactProvider>
					</React.Suspense>
				),
			},
			// PARAMS
			{
				path: 'impuestos',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<ImpuestoParams />
					</React.Suspense>
				),
			},
			{
				path: 'correlativo',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<Correlativo />
					</React.Suspense>
				),
			},
			{
				path: 'tipos-cambio',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TipoPagoParams />
					</React.Suspense>
				),
			},
			{
				path: 'tipos-habitacion',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TipoHabParams />
					</React.Suspense>
				),
			},
			{
				path: 'tipos-servicio',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TipoServParams />
					</React.Suspense>
				),
			},
			{
				path: 'area',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<AreaParams />
					</React.Suspense>
				),
			},
			{
				path: 'nivel',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<NivelParams />
					</React.Suspense>
				),
			},
			// DATOS
			{
				path: 'habitacion',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<HabitacionData />
					</React.Suspense>
				),
			},
			{
				path: 'cliente',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<ClienteData />
					</React.Suspense>
				),
			},
			{
				path: 'servicio',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<ServicioData />
					</React.Suspense>
				),
			},
			{
				path: 'vendedor',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<Vendedor />
					</React.Suspense>
				),
			},
			{
				path: 'pais',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<PaisData />
					</React.Suspense>
				),
			},
			{
				path: 'departamento',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<DepartamentoData />
					</React.Suspense>
				),
			},
			{
				path: 'producto',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<ProductoData />
					</React.Suspense>
				),
			},
			// MOVIMIENTOS
			{
				path: 'servicios-habitacion',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TransactProvider>
							<OrdenMoves />
						</TransactProvider>
					</React.Suspense>
				),
			},
			{
				path: 'check-in',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TransactProvider>
							<CheckInMoves stateTran={0} />
						</TransactProvider>
					</React.Suspense>
				),
			},
			{
				path: 'check-out',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TransactProvider>
							<CheckInMoves stateTran={1} />
						</TransactProvider>
					</React.Suspense>
				),
			},
			{
				path: 'reservaciones',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TransactProvider>
							<ReservacionMoves />
						</TransactProvider>
					</React.Suspense>
				),
			},
			{
				path: 'compras',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<ComprasProvider>
							<CompraMoves />
						</ComprasProvider>
					</React.Suspense>
				),
			},
			{
				path: 'pagos',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<TransactProvider>
							<PagoMoves />
						</TransactProvider>
					</React.Suspense>
				),
			},
			// PROCESOS
			{
				path: 'actualizacion-saldos',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<SaldosProcess />
					</React.Suspense>
				),
			},
			{
				path: 'actualizacion-existencias',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<StocksProcess />
					</React.Suspense>
				),
			},
			{
				path: 'cierre-turno',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<CierreProcess />
					</React.Suspense>
				),
			},
			// REPORTES
			{
				path: 'reporte-servicios',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<ServicioReport />
					</React.Suspense>
				),
			},
			{
				path: 'reporte-clientes',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<ClienteReport />
					</React.Suspense>
				),
			},
			{
				path: 'reporte-transacciones',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<MovimientosReport />
					</React.Suspense>
				),
			},
			{
				path: 'reporte-gerencial',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<GerencialReport />
					</React.Suspense>
				),
			},
			{
				path: 'reporte-ventas',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<Ventas />
					</React.Suspense>
				),
			},
			{
				path: 'reporte-ventas-habitacion',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<Habitacion />
					</React.Suspense>
				),
			},
			{
				path: 'reporte-usabilidad',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<Usabilidad />
					</React.Suspense>
				),
			},
			{
				path: 'reporte-ventas-cobros',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<VentasCobros />
					</React.Suspense>
				),
			},
			{
				path: 'historial-cierres',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<CierreReport />
					</React.Suspense>
				),
			},
			// SEGURIDAD
			{
				path: 'empresa',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<CompaniaSecurity />
					</React.Suspense>
				),
			},
			{
				path: 'perfiles',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<PerfilProvider>
							<PerfilSecurity />
						</PerfilProvider>
					</React.Suspense>
				),
			},
			{
				path: 'usuarios',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<UsuariosSecurity />
					</React.Suspense>
				),
			},
			{
				path: 'paginas',
				element: (
					<React.Suspense fallback={<GridSkeleton />}>
						<PaginaSecurity />
					</React.Suspense>
				),
			},
		],
	},
]);
