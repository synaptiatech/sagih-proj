import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Permiso = sequelize.define('permiso', {
	activo: {
		type: DataTypes.CHAR,
		allowNull: true,
		defaultValue: 'S',
	},
});
