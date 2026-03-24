import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Usuario = sequelize.define('usuario', {
	codigo: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	usuario: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
