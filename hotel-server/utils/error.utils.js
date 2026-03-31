/**
 * Función que maneja los errores del sistema y de la base de datos
 * @param {import("express").Response} res Respuesta de la petición
 * @param {Object | string} error Error que se quiere mostrar en la respuesta
 */
export const errorHandler = (res, error) => {
	// Evitar doble respuesta
	if (res.headersSent) {
		console.error('Attempted to send error response after headers were sent');
		console.error('Original error:', error);
		return;
	}

	console.error('Error captured by errorHandler:', error);

	let statusCode = 500;
	let code = 'INTERNAL_ERROR';
	let message = 'Error en el servidor';

	if (typeof error === 'string') {
		code = 'APP_ERROR';
		message = error;
	} else if (error && error.message) {
		message = error.message;
	}

	if (error && error.code) {
		switch (error.code) {
			case '22003':
				statusCode = 400;
				code = 'VALUE_TOO_LONG';
				message = 'El valor ingresado es muy largo';
				break;

			case '23502':
				statusCode = 400;
				code = 'REQUIRED_FIELD';
				message = `No se puede dejar el campo ${
					error.column?.replace('_', ' ') || ''
				} vacío`;
				break;

			case '23503':
				statusCode = 400;
				code = 'RELATED_RECORD_EXISTS';
				message =
					'El registro que desea eliminar tiene relaciones asociadas';
				break;

			case '23505':
				statusCode = 400;
				code = 'DUPLICATE_RECORD';
				message = 'El registro que intenta ingresar ya existe';
				break;

			case '23514':
				statusCode = 400;
				code = 'INVALID_VALUE';
				message = 'El valor ingresado no es válido';
				break;

			case '22P02':
				statusCode = 400;
				code = 'INVALID_FORMAT';
				message = 'El formato del valor ingresado no es válido';
				break;

			case '22007':
				statusCode = 400;
				code = 'INVALID_DATE';
				message = 'La fecha ingresada no tiene un formato válido';
				break;

			case 'ENOENT':
				statusCode = 500;
				code = 'FILE_NOT_FOUND';
				message =
					'No se encontró un recurso necesario para completar la operación';
				break;

			default:
				break;
		}
	}

	return res.status(statusCode).json({
		ok: false,
		error: {
			code,
			message,
		},
	});
};
