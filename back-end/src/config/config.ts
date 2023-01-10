import { EnvConfiguration } from 'src/config/interface/config.interface';

// Ensure type checking
export const config: EnvConfiguration = {
	app: {
		host: process.env.HOST,
		base: process.env.BASE_URL,
		port: process.env.PORT,
		env: process.env.NODE_ENV,
		whitelist: JSON.parse(process.env.WHITELIST),
		redirect: process.env.FRONT_URL_REDIRECT,
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
	mailjet: {
		user: process.env.MAILJET_USER,
		pass: process.env.MAILJET_PASS,
		noreply: process.env.MAILJET_NOREPLY,
	},
};
