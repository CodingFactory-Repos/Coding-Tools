export interface EnvConfiguration {
	app: Configuration.Application;
	mongo: Configuration.MongoDB;
	jwt: Configuration.JWT;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Configuration {
	export interface Application {
		host: string;
		port: string;
		env: string;
		whitelist: Array<string>;
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
}
