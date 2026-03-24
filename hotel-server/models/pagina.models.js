import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Pagina = sequelize.define('pagina', {
	codigo: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	descripcion: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	modulo: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	objeto: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: null,
	},
	indice: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	forma: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: null,
	},
});
