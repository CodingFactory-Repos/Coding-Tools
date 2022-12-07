import { getDb } from "./mongo";

// Global express.js configuration
export const config = {
	app: {
		host: process.env.HOST,
		port: process.env.PORT,
		env: process.env.NODE_ENV,
		whitelist: process.env.WHITELIST,
	},
	mongo: {
		uri: process.env.MONGO_URI,
		name: process.env.MONGO_DBNAME,
	}
};

// Global mongodb instance
export const mongodb = getDb(config.mongo.uri, config.mongo.name);