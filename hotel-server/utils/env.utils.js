import { config } from 'dotenv';
console.log('----> Loading environment variables...', process.env.NODE_ENV);
// config({ path: `./.env.${process.env.NODE_ENV}` });
// if (process.env.NODE_ENV.includes('prod')) {
// 	config({ path: './.env.production' });
// } else {
// 	config({ path: './.env.development' });
// }
