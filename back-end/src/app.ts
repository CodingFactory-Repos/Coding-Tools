import 'reflect-metadata';
// import { defaultMetadataStorage } from 'class-transformer';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from '@/api/common/middlewares/error.middleware';

import { config } from '@/config/config';

class App {
	public app: express.Application;
	public env: string;
	public host: string;
	public port: string | number;

	constructor(Controllers: Function[]) {
		this.app = express();
		this.env = config.app.env || 'development';
		this.host = config.app.host || 'http://localhost';
		this.port = config.app.port || 6000;

		this.initializeMiddlewares();
		this.initializeRoutes(Controllers);
		this.initializeSwagger(Controllers);
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`🚀 App listening on the port ${this.host}:${this.port}`);
		});
	}

	public getServer() {
		return this.app;
	}

	private initializeMiddlewares() {
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
	}

	private initializeRoutes(controllers: Function[]) {
		useExpressServer(this.app, {
			cors: {
				origin: config.app.host,
				credentials: true,
			},
			controllers: controllers,
			defaultErrorHandler: false,
		});
	}

	private initializeSwagger(controllers: Function[]) {
		const schemas = validationMetadatasToSchemas({
			//   classTransformerMetadataStorage: defaultMetadataStorage,
			refPointerPrefix: '#/components/schemas/',
		});

		const routingControllersOptions = {
			controllers: controllers,
		};

		const storage = getMetadataArgsStorage();
		const spec = routingControllersToSpec(storage, routingControllersOptions, {
			components: {
				schemas,
				securitySchemes: {
					basicAuth: {
						scheme: 'basic',
						type: 'http',
					},
				},
			},
			info: {
				description: 'Generated with `routing-controllers-openapi`',
				title: 'A sample API',
				version: '1.0.0',
			},
		});

		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}
}

export default App;
