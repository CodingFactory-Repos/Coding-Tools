import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

// Check environement configuration
import 'src/config/env.validator';
import { config } from 'src/config/config';

import { AppModule } from 'src/app.module';
import { corsOptionsDelegate } from 'src/config/cors';

//! Proxy settings, production only
// import { NestExpressApplication } from '@nestjs/platform-express';
// <NestExpressApplication>
// app.set('trust proxy', 1);

async function bootstrap() {
	const PORT = config.app.port;
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			disableErrorMessages: false,
			whitelist: true,
			enableDebugMessages: true,
		}),
	);

	app.use(cookieParser());
	app.enableCors(corsOptionsDelegate);
	//! versioning, production only
	// app.enableVersioning({
	// 	type: VersioningType.URI,
	// 	defaultVersion: '1',
	// 	prefix: 'api/v',
	// });

	await app.listen(PORT);
	return app.getUrl();
}

(async (): Promise<void> => {
	try {
		const url = await bootstrap();
		NestLogger.debug(`Nest application running at : ${url}`, 'Bootstrap');
	} catch (error) {
		NestLogger.error(error, 'Bootstrap');
	}
})();
