import 'reflect-metadata';
import { EOL } from 'os';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

import { attachControllers, Type } from '@decorators/express';
import { config } from '@/config/config';

class App {
	public app: express.Application;
	public env: string;
	public host: string;
	public port: string | number;

	constructor(controllers: Array<Type>) {
		this.env = config.app.env || 'development';
		this.host = config.app.host || 'http://localhost';
		this.port = config.app.port || 6000;
		this.bootstrap(controllers);
	}

	public bootstrap(controllers: Array<Type>) {
		this.app = express();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
	}

	public listen() {
		this.app.listen(this.port, () => {
			const listenMsg = `🚀 App listening on ${this.host}:${this.port}`;

			console.log(`[EXPRESS] - Server mounted ✅`);
			console.log(`
				${'@'.repeat(listenMsg.length + 8)}
				@@${' '.repeat(listenMsg.length + 4)}@@
				@@  ${listenMsg}  @@
				@@${' '.repeat(listenMsg.length + 4)}@@
				${'@'.repeat(listenMsg.length + 8)}
			`);
		});
	}

	public getServer() {
		return this.app;
	}

	/**
	 * Set of security middlewares run before you have acces to any controller
	 */
	private initializeMiddlewares() {
		//accept CORS
		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			res.header(
				'Access-Control-Allow-Headers',
				'Content-Type, Authorization, Content-Length, X-Requested-With',
			);
			next();
		});
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
