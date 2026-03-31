import swal from 'sweetalert';

export const handleError = (fallbackText: string, error: any) => {
	console.error('Error capturado:', error);

	// Prioridad de mensajes
	const message =
		error?.friendlyMessage || // Axios interceptor
		error?.response?.data?.error?.message || // Backend estructurado
		error?.response?.data?.message || // Alternativo backend
		error?.message || // Error estándar JS
		fallbackText || // Mensaje enviado manualmente
		'Ocurrió un error inesperado';

	swal({
		title: 'Error',
		text: message,
		icon: 'error',
		timer: 3000,
	});
};

export const handleDelete = (callback: () => any) => {
	swal({
		title: '¿Deseas eliminar el registro?',
		text: 'Una vez eliminado, no se podrá recuperar',
		icon: 'warning',
		buttons: ['Cancelar', 'Eliminar'],
		dangerMode: true,
	}).then((willDelete) => {
		if (!willDelete) return;
		callback();
	});
};
