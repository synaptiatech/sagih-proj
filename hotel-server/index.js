import 'dotenv/config.js';
// import './utils/env.utils.js';
import app from './app.js';
import { getOneQueryMethod } from './db/querys.js';
import { __dirname, logger } from './utils/log.utils.js';
import { VARS } from './config/vars.config.js';

async function main() {
	try {
		// await sequelize.sync({ force: false });
		// const response = await pool.query('SELECT NOW()');

		getOneQueryMethod({
			table: 'now()',
		})
			.then((response) => {
				console.log('Connected to the database:', response);
			})
			.catch((error) => {
				logger(__dirname, 'main', error);
			});

		var PORT = VARS.API_PORT;
		app.listen(PORT, () => {
			console.info(`Server running on port ${PORT} 🚀`);
			console.info({ VARS });
		});
	} catch (error) {
		logger(__dirname, 'main', error);
	}
}

main();
