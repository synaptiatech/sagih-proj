import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Departamento } from './departamento.models.js';

export const Pais = sequelize.define('pais', {
	codigo: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	iso2: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
	},
	descripcion: {
		type: DataTypes.STRING,
	},
});

Pais.hasMany(Departamento, {
	foreignKey: 'codigoPais',
	sourceKey: 'codigo',
});

Departamento.belongsTo(Pais, {
	foreignKey: 'codigoPais',
	targetKey: 'codigo',
});
