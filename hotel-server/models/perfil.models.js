import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Usuario } from './usuario.models.js';

export const Perfil = sequelize.define('perfil', {
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

// Perfil.hasMany(Usuario, {
// 	foreignKey: {
// 		name: 'perfilId',
// 		allowNull: false,
// 		field: 'perfil_id',
// 		unique: false,
// 		primaryKey: false,
// 		references: {
// 			model: Usuario,
// 			key: 'perfil_id',
// 			deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
// 			onDelete: 'cascade',
// 			onUpdate: 'cascade',
// 			hooks: true,
// 			group: 'perfil',
// 			paranoid: false,
// 		}
// 	}
// })
