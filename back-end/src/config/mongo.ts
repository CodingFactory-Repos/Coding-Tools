import { EventEmitter } from 'events';

import {
	MongoClientOptions,
	CollectionOptions,
	MongoClient,
	Db,
} from 'mongodb';


class MongoDb extends EventEmitter {
	/**
	 * MongoDb Client
	 * @internal
	*/
	_client: MongoClient;

	/**
	 * MongoDb Instance
	 * @internal
	*/
	static _instance: MongoDb;

	/**
	 * Is MongoDb successfully connected
	 * @internal
	*/
	_isInit = false;

	/**
	 * Name of the MongoDb database
	 * @internal
	*/
	_dbName: string;

	/**
	 * MongoDb database
	 * @internal
	*/
	_db: Db;

	/**
	 * Sets MongoDb client and name
	 *
	 * @param mongoUri - Uri MongoDb will try to connect to
	 * @param dbName - Name of the MongoDb database
	 * @param [clientOptions] - `optional` - MongoDb options
	 */
	constructor(mongoUri: string, dbName: string, clientOptions?: MongoClientOptions) {
		super();
		this._client = new MongoClient(mongoUri, clientOptions);
		this._dbName = dbName;
	}

	/**
	 * Returns a newly initialized MongoDb instance
	 *
	 * @param mongoUri - Uri MongoDb will try to connect to
	 * @param dbName - Name of the MongoDb database
	 * @param clientOptions -  `optional` MongoDb options
	 *
	 * @static
	 */
	static getDb(mongoUri: string, dbName: string, clientOptions?: MongoClientOptions) {
		if(MongoDb._instance) return MongoDb._instance;

		MongoDb._instance = new MongoDb(mongoUri, dbName, clientOptions);
		return MongoDb._instance;
	}

	/**
	 * Returns a MongoDb table collection
	 *
	 * @param name - Name of the table collection
	 * @param options - `optional` MongoDb collectin options
	 */
	collection(name: string, options?: CollectionOptions) {
		return this._db.collection(name, options)
	}

	/**
	 * Intialize the connection to MongoDb.
	 * Emit the initialization event with `EventEmitter`.
	 */
	async init() {
		await this._client.connect();
		this._db = this._client.db(this._dbName);
		this._isInit = true;
		this.emit('initDone');
	}

	get isInit() { return this._isInit };
	get client() { return this._client };
	get dbName() { return this._dbName };
	get db()     { return this._db };
}

// Export static mongo class, no re-use.
export const getDb = MongoDb.getDb;