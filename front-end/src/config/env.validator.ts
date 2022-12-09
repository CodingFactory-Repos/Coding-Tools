// \n compatible for macOS and Window
import { EOL } from 'os';

const envsToCheck = ['API_BASE_URL', 'CREDENTIALS'];

const missing = [];
for (const checked of envsToCheck) {
	if (!process.env[checked]) missing.push(`undefined process.env.${checked}`);
}

if (missing.length > 0) {
	throw new Error(`${EOL}${missing.join(EOL)}${EOL}Trace:`);
}
 