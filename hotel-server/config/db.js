// import Sequelize from 'sequelize';
import pg from 'pg';
import { VARS } from './vars.config.js';
const { Pool } = pg;

const environment = {
	user: VARS.API_DB_USER || 'postgres',
	password: VARS.API_DB_PASS || 'root',
	database: VARS.API_DB_NAME || 'hoteldb',
	host: VARS.API_DB_HOST || '127.0.0.1',
	port: VARS.API_DB_PORT || 5432,
	dialect: VARS.API_DB_DIALECT || 'postgres',
};

console.log(environment);

export const pool = new Pool({
	user: environment.user,
	host: environment.host,
	database: environment.database,
	password: environment.password,
	port: environment.port,
});
