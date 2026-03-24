export const BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_v1 = BASE_URL + '/api';

export const URI = {
	general: '/general',
	login: '/login',
	logup: '/logup',
	impuesto: '/impuesto',
	servicio: {
		_: '/servicio',
		tipo: '/servicio/tipo',
	},
	habitacion: {
		_: '/habitacion',
		area: '/habitacion/area',
		nivel: '/habitacion/nivel',
		tipo: '/habitacion/tipo',
	},
	pago: '/pago',
	cliente: '/cliente',
	pais: '/pais',
	departamento: '/departamento',
	producto: '/producto',
	funcion: '/funcion',
	pagina: '/pagina',
	permiso: '/permiso',
	usuario: '/usuario',
	vendedor: '/vendedor',
	transaccion: '/transaccion',
	recibo: '/recibo',
	reporte: '/reporte',
	compra: '/compra',
	empresa: '/empresa',
	perfil: '/perfil',
	cierre: '/cierre',
	correlativo: '/correlativo',
};
