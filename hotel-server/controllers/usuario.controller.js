import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { VARS } from '../config/vars.config.js';
import { functionName, tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getByFunction,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { generateHTML } from '../utils/email.utils.js';
import { errorHandler } from '../utils/error.utils.js';
import {
	compararPassword,
	encriptarPassword,
	generateToken,
} from '../utils/token.js';

const UPPERCASELETTERS = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
const LOWERCASELETTERS = 'abcdefghijklmnpqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '+-*/.,:;';

const generatePassword = () => {
	const characters = `${UPPERCASELETTERS}${LOWERCASELETTERS}${NUMBERS}${SYMBOLS}`;
	let password = '';
	for (let i = 0; i < 10; i++) {
		password += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return password;
};

const sendEmail_AWS_SES = async ({ from, to, subject, username, password }) => {
	console.log({ from, to, subject, username, password });
	const client = new SESClient({
		region: VARS.AWS_BUCKET_REGION,
		credentials: {
			accessKeyId: VARS.AWS_PUBLIC_KEY,
			secretAccessKey: VARS.AWS_SECRET_KEY,
		},
	});
	const htmlToSending = generateHTML({
		username: username,
		password: password,
	});

	const input = {
		Source: from,
		Destination: {
			ToAddresses: [to],
		},
		ReplyToAddresses: [],
		Message: {
			Subject: {
				Data: subject,
				Charset: 'UTF-8',
			},
			Body: {
				Text: {
					Data: 'This is the message body in text format.',
					Charset: 'UTF-8',
				},
				Html: {
					Data: htmlToSending,
					Charset: 'UTF-8',
				},
			},
		},
	};
	try {
		const command = new SendEmailCommand(input);
		const response = await client.send(command);
		console.log(response);
		return response;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};

const sendEmail_Gmail = async ({ from, to, subject, username, password }) => {
	console.log('sendEmail', { from, to, subject, username, password });
	// let testAccount = await nodemailer.createTestAccount();
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: VARS.API_EMAIL_USER, // generated ethereal user
			pass: VARS.API_EMAIL_PWD, // generated ethereal password
		},
	});

	let info = await transporter.sendMail({
		from: from, // sender address
		to: to, // list of receivers
		subject: subject, // Subject line
		text: password, // plain text body
		html: generateHTML({ username: username, password: password }),
	});

	console.log('************');
	console.log(info);
	console.log('************');
	return info;
};

const sendEmail_Resend = async ({ from, to, subject, username, password }) => {
	console.log('sendEmail', { from, to, subject, username, password });

	const resend = new Resend(VARS.API_EMAIL_KEY);

	const { data, error } = await resend.emails.send({
		from: from,
		to: to,
		subject: subject,
		html: generateHTML({ username: username, password: password }),
	});
	console.log({ data, error });
	if (error) throw new Error(error);
	return data;
};

export const loginWithGoogle = async (req, res) => {
	const { correo } = req.body;
	console.log(req.body);
	try {
		const result = await getOneQueryMethod({
			table: tablesName.USUARIO,
			query: { correo },
		});
		if (!result)
			throw new Error(`No se encuentra el correo ${correo} registrado`);

		const token = generateToken({ usuario: result.usuario });

		res.status(200).json({
			login: true,
			token: token,
			data: {
				usuario: result.usuario,
				correo: result.correo,
				perfil: result.perfil,
			},
			accessPages: ['admin', 'user'],
		});
	} catch (error) {
		errorHandler(res, error);
	}
};

export const login = async (req, res) => {
	const { usuario, password } = req.body;
	try {
		const result = await getOneQueryMethod({
			table: 'usuario',
			query: { usuario },
		});
		if (!result) {
			throw new Error(`No se encuentra el usuario ${usuario} registrado`);
		}

		const isValidPassword = await compararPassword(
			password,
			result.password
		);

		if (!isValidPassword) {
			throw new Error('Contraseña incorrecta');
		}

		const permisos = await getByFunction(functionName.FN_PERMISOS, {
			n_funcion: 'Ver',
			cod_perfil: result.perfil,
			val_estado: 1,
		});

		const payload = {
			codigo: result.codigo,
			usuario: result.usuario,
		};
		const token = generateToken(payload);

		res.status(200).json({
			login: true,
			token,
			data: {
				usuario: result.usuario,
				correo: result.correo,
				perfil: result.perfil,
			},
			permisos,
		});
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getUsuario = async ({ query }, res) => {
	try {
		const result = await getOneQueryMethod({
			table: tablesName.USUARIO,
			query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getProfile = async ({ query, user }, res) => {
	try {
		console.log('getProfile', user);
		const result = await getOneQueryMethod({
			table: tablesName.USUARIO,
			query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getUsuarios = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const recoveryPassword = async ({ query }, res) => {
	try {
		const { email } = query;
		const user = await getOneQueryMethod({
			table: tablesName.USUARIO,
			columns: {
				codigo: 'Codigo',
				usuario: 'Usuario',
				correo: 'Correo',
			},
			query: { correo: email },
		});
		console.log({ user });

		if (!user) throw new Error('El correo no esta registrado');

		const password = generatePassword();
		const hashedPassword = await encriptarPassword(password);
		const info = await sendEmail_Gmail({
			from: VARS.API_EMAIL_USER,
			to: email,
			subject: 'Recuperación de contraseña',
			username: user?.usuario ?? 'Tu usuario',
		});
		// const info = await sendEmail_Resend({
		// 	from: VARS.API_EMAIL_USER,
		// 	to: email,
		// 	password: password,
		// 	subject: 'Recuperación de contraseña',
		// 	username: user?.usuario ?? 'Tu usuario',
		// });
		console.log('Correo electronico enviado...', info);
		const result = updateQuery(
			tablesName.USUARIO,
			{ password: hashedPassword },
			{ codigo: user?.codigo ?? 0 }
		);

		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createUsuario = async (req, res) => {
	const { perfil, usuario, correo, pass } = req.body;
	try {
		const result = await getOneQueryMethod({
			table: tablesName.USUARIO,
			query: { correo },
		});
		if (result) throw new Error('El correo ya esta registrado');

		const password = pass ? pass : generatePassword();
		const hashedPassword = await encriptarPassword(password);

		console.log({ perfil, usuario, correo, password });

		const results = await insertQuery(tablesName.USUARIO, {
			perfil,
			usuario,
			correo,
			password: hashedPassword,
		});

		// ENVIAR CORREO ELECTRONICO CON LA CONTRASEÑA GENERADA
		console.log('Enviando correo electronico...');
		const info = await sendEmail_Gmail({
			from: VARS.API_EMAIL_USER,
			to: correo,
			subject: 'Contraseña generada',
			username: usuario,
			password: password,
		});
		// const info = await sendEmail_AWS_SES({
		// 	from: 'noreplay@sagih.com',
		// 	to: correo,
		// 	subject: 'Contraseña generada',
		// 	username: usuario,
		// 	password: password,
		// });
		console.log('Correo electronico enviado...', info);

		res.status(200).json(results.rows);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updatePerfilUsuario = async ({ body, query }, res) => {
	try {
		const result = await updateQuery(tablesName.USUARIO, body, query);
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateUsuario = async ({ body, query }, res) => {
	try {
		let data = {
			usuario: body.usuario,
			correo: body.correo,
		};
		if (body.password) {
			const hashedPassword = await encriptarPassword(body.password);
			data.password = hashedPassword;
		}
		const result = await updateQuery(tablesName.USUARIO, data, query);
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteUsuario = async ({ query }, res) => {
	console.log('Eliminar usuario...');
	try {
		const result = await deleteQuery('usuario', query);
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};
