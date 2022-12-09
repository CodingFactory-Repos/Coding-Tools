import { EnvConfiguration } from 'src/config/interface/config.interface';

// Ensure type checking
export const config: EnvConfiguration = {
	app: {
		host: process.env.HOST,
		port: process.env.PORT,
		env: process.env.NODE_ENV,
		whitelist: JSON.parse(process.env.WHITELIST),
	},
	mongo: {
		uri: process.env.MONGO_URI,
		dbname: process.env.MONGO_DBNAME,
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		cookie: {
			secure: JSON.parse(process.env.COOKIE_SECURE),
			samesite: JSON.parse(process.env.COOKIE_SAMESITE),
		},
	},
};
