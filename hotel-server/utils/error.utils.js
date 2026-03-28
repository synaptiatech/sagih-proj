/**
 * Función que maneja los errores de la base de datos
 * @param {import("express").Response} res Respuesta de la petición
 * @param {Object | string} error Error que se quiere mostrar en la respuesta. Puede ser un error de postgres o un string
 */
export const errorHandler = (res, error) => {
    // VERIFICACIÓN CRÍTICA: No enviar si ya se respondió
    if (res.headersSent) {
        console.error('⚠️ errorHandler llamado pero headers ya enviados');
        console.error('Error original:', error);
        return;
    }
    
    console.error('Error:', error);
    let statusCode = 500;
    let message = 'Error en el servidor';

    if (typeof error === 'string') {
        message = error;
    } else if (error && error.message) {
        message = error.message;
    }

    if (error && error.code) {
        switch (error.code) {
            case '22003':
                statusCode = 400;
                message = 'El valor ingresado es muy largo';
                break;
            case '23502':
                statusCode = 400;
                message = `No se puede dejar el campo ${error.column?.replace('_', ' ') || ''} vacío`;
                break;
            case '23503':
                statusCode = 400;
                message = 'El registro que desea eliminar tiene relaciones asociadas';
                break;
            case '23505':
                statusCode = 400;
                message = 'El registro que intenta ingresar ya existe';
                break;
            case '23514':
                statusCode = 400;
                message = 'El valor ingresado no es válido';
                break;
            case '22P02':
                statusCode = 400;
                message = 'El valor ingresado no es válido';
                break;
            default:
                break;
        }
    }

    // Enviar respuesta solo si headers NO fueron enviados
    if (!res.headersSent) {
        res.status(statusCode).json({ error: message });
    }
};

/**
 * Función que maneja los errores de la base de datos
 * @param {import("express").Response} res Respuesta de la petición
 * @param {Object | string} error Error que se quiere mostrar en la respuesta. Puede ser un error de postgres o un string
 */
/*
export const errorHandler = (res, error) => {
	console.log('Error:', error);
	let statusCode = 500;
	let message = 'Error en el servidor';

	if (typeof error === 'string') {
		message = error;
	} else if (error && error.message) {
		message = error.message;
	}

	if (error && error.code) {
		switch (error.code) {
			case '22003':
				statusCode = 400;
				message = 'El valor ingresado es muy largo';
				break;
			case '23502':
				statusCode = 400;
				message = `No se puede dejar el campo ${error.column.replace(
					'_',
					' '
				)} vacío`;
				break;
			case '23503':
				statusCode = 400;
				message =
					'El registro que desea eliminar, tiene relaciones asociadas';
				break;
			case '23505':
				statusCode = 400;
				message = 'El registro que intenta ingresar ya existe';
				break;
			case '23514':
				statusCode = 400;
				message = 'El valor ingresado no es válido';
				break;
			case '22P02':
				statusCode = 400;
				message = 'El valor ingresado no es válido';
				break;
			default:
				break;
		}
	}

	res.status(statusCode).json({
		error: message,
	});
};
*/
