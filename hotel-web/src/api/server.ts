import axios from 'axios';
import { API_v1 } from '../consts/Uri';

const api = axios.create({
	baseURL: API_v1,
	headers: {
		Authorization: `Bearer ${
			JSON.parse(localStorage.getItem('SAGH') || '{}')?.state?.token ?? ''
		}`,
	},
});

export default api;
