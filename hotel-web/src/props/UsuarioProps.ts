import * as yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(yup);

export interface UsuarioProps {
	usuario?: UsuarioType;
	onClose: () => void;
}

export interface UsuarioType {
	codigo?: number;
	perfil: number;
	usuario: string;
	password: string;
	passwordConfirmation?: string;
	correo: string;
	googleId?: string;
}

export const schemaLogup = yup.object().shape({
	usuario: yup
		.string()
		.required('Usuario es requerido')
		.max(45, 'Máximo 45 caracteres'),
	password: yup
		.string()
		.required('Contraseña es requerido')
		.password()
		.max(15, 'Máximo 15 caracteres'),
	passwordConfirmation: yup
		.string()
		.required('Confirmación de contraseña es requerido')
		.oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
	correo: yup
		.string()
		.required('Correo es requerido')
		.max(45, 'Máximo 45 caracteres')
		.email('Correo no válido'),
});

export const schemaLogin = yup.object().shape({
	usuario: yup
		.string()
		.required('Usuario es requerido')
		.max(45, 'Máximo 45 caracteres'),
	password: yup
		.string()
		.required('Contraseña es requerido')
		// .password()
		.max(15, 'Máximo 15 caracteres'),
});

export const schemaCreate = yup.object().shape({
	usuario: yup
		.string()
		.required('Usuario es requerido')
		.max(45, 'Máximo 45 caracteres'),
	perfil: yup.number().required('Perfil es requerido'),
	correo: yup
		.string()
		.required('Correo es requerido')
		.max(45, 'Máximo 45 caracteres')
		.email('Correo no válido'),
	password: yup
		.string()
		.optional()
		.password()
		.min(8, 'Mínimo de 8 caracteres')
		.max(15, 'Máximo 15 caracteres')
		.minLowercase(1, 'Mínimo 1 letra minúscula')
		.minUppercase(1, 'Mínimo 1 letra mayúscula')
		.minNumbers(1, 'Mínimo 1 número')
		.minSymbols(1, 'Mínimo 1 caracter especial'),
});
