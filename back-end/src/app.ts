import 'reflect-metadata';
import EventEmitter from 'events';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

import { attachControllers, Type } from '@decorators/express';
import { mongodb, config } from '@/config/config';

class App extends EventEmitter {
	public app: express.Application;
	public env: string;
	public host: string;
	public port: string | number;

	constructor(controllers: Array<Type>) {
		super();

		this.env = config.app.env || 'development';
		this.host = config.app.host || 'http://localhost';
		this.port = config.app.port || 6000;
		mongodb.init();
		
		mongodb.on("initDone", () => {
			console.log("Mongodb connected !");
			this.bootstrap(controllers);
		});
	}

	public bootstrap(controllers: Array<Type>) {
		this.app = express();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
		this.emit('expressMounted');
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`🚀 App listening on ${this.host}:${this.port}`);
		});
	}

	public getServer() {
		return this.app;
	}

	/**
	 * Set of security middlewares run before you have acces to any controller
	 */
	private initializeMiddlewares() {
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
	}

	private initializeControllers(controllers: Array<Type>) {
		attachControllers(this.app, controllers);
	}
}

export default App;
