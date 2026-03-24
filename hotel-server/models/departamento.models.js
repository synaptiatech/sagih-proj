import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Departamento = sequelize.define('departamento', {
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
	},
});
