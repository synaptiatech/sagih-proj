import * as Yup from 'yup';

export type UserProfileType = {
	codigo: number;
	correo: string;
	password: string;
	confirmPassword: string;
	perfil: number;
	usuario: string;
};

export const userProfileDefault: UserProfileType = {
	codigo: 0,
	correo: '',
	password: '',
	confirmPassword: '',
	perfil: 0,
	usuario: '',
};

export const UserProfileSchema = Yup.object().shape({
	codigo: Yup.number().required('El código es requerido'),
	correo: Yup.string()
		.email('El correo no es válido')
		.required('El correo es requerido'),
	usuario: Yup.string().required('El usuario es requerido'),
	password: Yup.string().optional(),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
		.optional(),
});
