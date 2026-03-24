import { __dirname, logger } from '../utils/log.utils.js';
import { verifyToken } from '../utils/token.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
export const ensureAuth = (req, res, next) => {
	try {
		const authorization = req.headers.authorization.split(' ');

		if (authorization.length !== 2) {
			logger(__dirname, 'ensureAuth', 'No se ha enviado el token');
			return res.status(404).json({ error: 'No se ha enviado el token' });
		}

		const token = authorization[1];

		const payload = verifyToken(token);

		req.user = payload;
		next();
	} catch (ex) {
		logger(__dirname, 'ensureAuth', ex);
		return res.status(404).json({ error: 'El token no es valido' });
	}
};
