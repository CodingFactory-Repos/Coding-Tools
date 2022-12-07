/**
 * dotenv.config() will load the .env located in your root project, they will be accessible throught process.env.VAR_NAME
 *
 *! Note: It should always be imported and configured before anything else.
 */
import dotenv from 'dotenv';
dotenv.config();

// \n compatible for macOS and Window
import { EOL } from 'os';

const envsToCheck = ['PORT', 'WHITELIST', 'FRONT_URL_REDIRECT', 'MONGO_URI', 'MONGO_DBNAME'];

const missing = [];
for (const checked of envsToCheck) {
	if (!process.env[checked]) missing.push(`undefined process.env.${checked}`);
}

if (missing.length > 0) {
	throw new Error(`${EOL}${missing.join(EOL)}${EOL}Trace:`);
}
