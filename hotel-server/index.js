import 'dotenv/config.js';
import app from './app.js';
import { getOneQueryMethod } from './db/querys.js';
import { __dirname, logger } from './utils/log.utils.js';
import { VARS } from './config/vars.config.js';

async function main() {
  try {
    getOneQueryMethod({
      table: 'now()',
    })
      .then((response) => {
        console.log('Connected to the database:', response);
      })
      .catch((error) => {
        logger(__dirname, 'main', error);
      });

    const PORT = process.env.PORT || VARS.API_PORT || 5005;

    app.listen(PORT, '0.0.0.0', () => {
      console.info(`Server running on port ${PORT} 🚀`);
      console.info({ VARS });
    });
  } catch (error) {
    logger(__dirname, 'main', error);
    process.exit(1);
  }
}

main();
