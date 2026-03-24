export interface DataUser {
	usuario: string;
	correo: string;
	perfil: number;
}

export interface PermisoUser {
	codigo: number;
	descripcion?: string;
	forma: string;
	indice?: number;
	menu: string;
	modulo: string;
	nombre: string;
}

export interface AuthState {
	login: boolean;
	token: string;
	data: DataUser;
	permisos: PermisoUser[];
}
