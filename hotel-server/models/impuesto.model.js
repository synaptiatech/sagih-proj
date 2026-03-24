import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Impuesto = sequelize.define('impuesto', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	porcentaje: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
			min: 0,
			max: 100,
		},
	},
});

// const Impuesto = sequelize.define('Impuesto', {
// 	idImpuesto: {
// 		type: DataTypes.INTEGER,
// 		allowNull: false,
// 		autoIncrement: true,
// 		primaryKey: true,
// 	},
// 	nombre: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 		unique: true,
// 	},
// 	porcentaje: {
// 		type: DataTypes.FLOAT,
// 		allowNull: false,
// 		unique: true,
// 		validate: {
// 			min: 0,
// 			max: 100,
// 		},
// 	},
// });

// export default Impuesto;
