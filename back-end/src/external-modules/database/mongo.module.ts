import { Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

import { config } from 'src/config/config';

@Module({
	providers: [
		{
			provide: 'DATABASE_CONNECTION',
			useFactory: async (): Promise<Db> => {
				try {
					const client = await MongoClient.connect(config.mongo.uri, {
						//! Production settings
						// useUnifiedTopology: true,
						// useNewUrlParser: true,
						// tls:true,
					});

					return client.db(config.mongo.dbname);
				} catch (e) {
					throw e;
				}
			},
		},
	],
	exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
