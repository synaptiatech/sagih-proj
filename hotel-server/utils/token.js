import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { VARS } from '../config/vars.config.js';

export const generateToken = ({ usuario }) => {
	const payload = {
		usuario,
	};
	const options = {
		expiresIn: '1d',
	};
	const secret = VARS.API_SECRET_WORD || 'secretword';
	return jwt.sign(payload, secret, options);
};

export const verifyToken = (token) => {
	const secret = VARS.API_SECRET_WORD || 'secretword';
	return jwt.verify(token, secret);
};

export const encriptarPassword = async (plainPassword) => {
	const saltRounds = 10;
	return await bcrypt.hash(plainPassword, saltRounds);
};

export const compararPassword = async (plainPassword, hashPassword) => {
	return await bcrypt.compare(plainPassword, hashPassword);
};
