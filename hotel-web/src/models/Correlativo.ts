import * as yup from 'yup';

export interface CorrelativoType {
	serie: string;
	tipo_transaccion: string;
	siguiente: number;
	tt_nombre: string;
}

export const correlativoDefault: CorrelativoType = {
	serie: '',
	tipo_transaccion: '',
	siguiente: 0,
	tt_nombre: '',
};

export const schemaCorrelativo = yup.object().shape({
	serie: yup
		.string()
		.required('Serie es requerido')
		.max(3, 'Máximo 3 caracteres'),
	tipo_transaccion: yup.string().required('Tipo Transaccion es requerido'),
	siguiente: yup
		.number()
		.required('No. documento es requerido')
		.test('siguiente', 'No. documento debe ser 0 o mayor', (value: any) => {
			return value >= 0;
		}),
});
