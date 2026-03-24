import { appendFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

/**
 * Función que escribe en el .log los cambios que se realizan en la base de datos
 * @param {string} dirname Directorio del archivo que llama al logger
 * @param {string} proc Nombre del proceso que llama al logger
 * @param {Object | string} message Mensaje que se quiere mostrar en el log
 */
export const logger = (dirname, proc, message) => {
	const filename = dirname.split('\\').pop();
	console.log(`[${filename}] [${proc}] ${JSON.stringify(message)}`);

	appendFile(
		'.log',
		`********** ********** ********** **********
    ${new Date().toLocaleDateString('es-GT')}
    [${filename}] [${proc}] 
    ${typeof message === 'object' ? JSON.stringify(message) : message}
********** ********** ********** **********
`,
		(err) => {
			if (err) console.log('[LOGGER][ERROR]', err);
		}
	);
};
