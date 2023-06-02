export interface EnvConfiguration {
	app: Configuration.Application;
	mongo: Configuration.MongoDB;
	jwt: Configuration.JWT;
	mailjet: Configuration.Mailjet;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Configuration {
	export interface Application {
		host: string;
		port: string;
		base: string;
		env: string;
		whitelist: Array<string>;
		redirect: string;
	}

	export interface MongoDB {
		uri: string;
		dbname: string;
	}

	export interface JWT {
		secret: string;
		cookie: Cookie;
	}

	export interface Cookie {
		secure: boolean;
		samesite: boolean;
	}

	export interface Mailjet {
		user: string;
		pass: string;
		noreply: string;
	}
}
