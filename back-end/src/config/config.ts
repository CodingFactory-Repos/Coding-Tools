import { getDb } from "./mongo";

export const config = {
	app: {
		host: process.env.HOST,
		port: process.env.PORT,
		env: process.env.NODE_ENV,
	},
	mongo: {
		uri: process.env.MONGO_URI,
		name: process.env.MONGO_DBNAME,
	}
};

export const mongodb = getDb(config.mongo.uri, config.mongo.name);