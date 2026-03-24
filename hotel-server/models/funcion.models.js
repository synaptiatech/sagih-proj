import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Funcionalidad } from './funcionalidad.models.js';
import { Pagina } from './pagina.models.js';

export const Funcion = sequelize.define('funcion', {
	codigo: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: null,
	},
	descripcion: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: null,
	},
});
