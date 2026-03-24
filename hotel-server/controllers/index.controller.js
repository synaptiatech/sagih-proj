export function getInfoApi(req, res) {
	console.log({ query: req.query, body: req.body });
	return res.status(200).json({
		date: new Date().toLocaleDateString('es-GT', {
			timeZone: 'America/Guatemala',
			dateStyle: 'long',
			timeStyle: 'medium',
		}),
		API: 'HotelAPI',
		Routes: {
			Info: '/api/',
			Usuarios: '/api/usuario',
			Permiso: '/api/permiso',
			Funcion: '/api/funcion',
			Pagina: '/api/pagina',
			Funcionalidad: '/api/funcionalidad',
			Servicio: '/api/servicio',
			Area: '/area',
			Habitacion: '/habitacion',
			Reserva: '/api/reserva',
			Pago: '/api/pago',
			Recibo: '/api/recibo',
			Cliente: '/api/cliente',
		},
	});
}
// export async function getInfoDB(req, res) {
// 	try {
// 		await authenticate();
// 		console.log('Connection has been established successfully.');
// 		return res.status(200).json({
// 			date: new Date().toLocaleDateString('es-MX'),
// 			DB: 'HotelDB',
// 		});
// 	} catch (error) {
// 		console.error('Unable to connect to the database:', error);
// 		return res.status(404).json({
// 			date: new Date().toLocaleDateString('es-MX'),
// 			DB: 'HotelDB',
// 		});
// 	}
// }
