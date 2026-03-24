import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const TipoFuncion = sequelize.define('tipo_funcion', {
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
		allowNull: true,
		defaultValue: '',
	},
});
