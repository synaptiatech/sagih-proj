import * as yup from 'yup';

export interface TiposProps {
	tipo?: TiposType;
	title: string;
	endpoint: string;
	open?: boolean;
	onClose: () => void;
	onDownload?: (item: number) => void;
}

export interface TiposType {
	codigo: number;
	nombre: string;
	descripcion: string;
}

export const schemaTipos = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.max(50, 'Máximo 50 caracteres'),
	descripcion: yup
		.string()
		.required('Descripcion es requerido')
		.max(100, 'Máximo 100 caracteres'),
});
