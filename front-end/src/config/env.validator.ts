export const envsToCheck = ['API_BASE_URL', 'CREDENTIALS'];

const missing = [];
for (const checked of envsToCheck) {
	if (!import.meta.env[checked]) missing.push(`undefined process.env.${checked}`);
}

if (missing.length > 0) {
	throw new Error(`\n${missing.join('\n')}\nTrace:`);
}
