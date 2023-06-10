import { JwtPayload } from '@/auth/interfaces/jwt.interface';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';

import { parseCookieString } from '@/common/helpers/string.helper';
import { config } from '@/config/config';
import { Logger as NestLogger } from '@nestjs/common';
import { WSServiceError } from '@/common/decorators/ws.catch.decorator';

export interface MaterialSocket extends Socket {
	user: JwtPayload;
	roomId: string;
}

export type MaterialMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const MaterialAuthMiddleware = (jwtService: JwtService): MaterialMiddleware => {
	return (socket: MaterialSocket, next) => {
		try {
			const materialCookies = socket.handshake.headers.cookie || '';
			const tokenMaterialCookie = parseCookieString(materialCookies);
			if (Object.keys(tokenMaterialCookie).length === 0)
				throw new Error('Could not find any cookies in the ws headers');
			const parsedTokenCookie = JSON.parse(tokenMaterialCookie['token']);
			const materialToken = parsedTokenCookie['token'];
			if (!materialToken) throw new Error('Token is undefined');

			const materialPayload = <JwtPayload>(
				jwtService.verify(materialToken, { secret: config.jwt.secret })
			);
			if (!materialPayload?.id || !(materialPayload?.role >= 0 && materialPayload?.role <= 3))
				throw new Error('The jwt content is invalid');
			materialPayload.id = new ObjectId(materialPayload.id);

			const roomId = socket.handshake.auth.roomId;

			socket.roomId = roomId;
			socket.user = materialPayload;
			next();
		} catch (err) {
			if (err instanceof Error) {
				NestLogger.error(err.message);
			}

			next(
				new WSServiceError('UNAUTHORIZED', 'You do not have the rights to access this resource'),
			);
		}
	};
};
