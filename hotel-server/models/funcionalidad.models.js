import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Perfil } from './perfil.models.js';
import { Permiso } from './permiso.models.js';

export const Funcionalidad = sequelize.define('funcionalidad', {
	estado: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 1,
	},
});
