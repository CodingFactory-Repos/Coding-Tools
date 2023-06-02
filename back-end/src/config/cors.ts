import { ForbiddenException } from '@nestjs/common';
import { CorsOptionsCallback } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Request } from 'express';

import { config } from 'src/config/config';

export const corsOptionsDelegate = (req: Request, callback: CorsOptionsCallback) => {
	const whitelist = config.app.whitelist;
	const origin = req.header('origin');

	console.log(origin, 'endpoint: ', req.url);
	if (origin && whitelist.indexOf(origin) !== -1) {
		return callback(null, { origin: true, credentials: true });
	} else if (origin === undefined) {
		return callback(null, { origin: true, credentials: true });
	}

	throw new ForbiddenException();
};
