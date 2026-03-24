export interface PermisoType {
	codigo: number;
	nombre: string;
	descripcion?: string;
	modulo: string;
	indice?: string;
	forma: string;
	menu: string;
}

export interface MenuContenidoType {
	Title: string;
	Path: string;
}

export interface MenuType {
	[key: string]: MenuContenidoType[];
}
