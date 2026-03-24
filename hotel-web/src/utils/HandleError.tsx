import swal from 'sweetalert';

export const handleError = (text: string, error: any) => {
	console.log('Error: ', { error });
	sweetAlert({
		title: 'Error',
		text: error.response?.data?.error || text,
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
