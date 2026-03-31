import axios from 'axios';
import { API_v1 } from '../consts/Uri';

const getToken = (): string => {
	try {
		const sagh = JSON.parse(localStorage.getItem('SAGH') || '{}');
		return sagh?.state?.token ?? '';
	} catch (error) {
		console.error('No se pudo leer el token desde localStorage', error);
		return '';
	}
};

const api = axios.create({
	baseURL: API_v1,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Interceptor de request
api.interceptors.request.use(
	(config) => {
		const token = getToken();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		} else if (config.headers.Authorization) {
			delete config.headers.Authorization;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor de response
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('AXIOS RESPONSE ERROR:', error);

		const status = error?.response?.status;
		const backendMessage =
			error?.response?.data?.error?.message ||
			error?.response?.data?.message;

		let message = backendMessage || 'Error en la comunicación con el servidor';

		if (!error.response) {
			message = 'No se pudo conectar con el servidor';
		} else if (status === 401) {
			message = backendMessage || 'Tu sesión ha expirado o no estás autorizado';
		} else if (status === 403) {
			message = backendMessage || 'No tienes permisos para realizar esta acción';
		} else if (status === 404) {
			message = backendMessage || 'No se encontró el recurso solicitado';
		} else if (status === 500) {
			message = backendMessage || 'Ocurrió un error interno en el servidor';
		}

		return Promise.reject({
			...error,
			friendlyMessage: message,
		});
	}
);

export default api;
