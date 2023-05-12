import { JwtPayload } from '@/auth/interfaces/jwt.interface';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';

import { parseCookieString } from '@/common/helpers/string.helper';
import { config } from '@/config/config';
import { Logger as NestLogger } from '@nestjs/common';
import { WSServiceError } from '@/common/decorators/ws.chat.decorator'; // C CV

export interface AuthSocket extends Socket {
	user: JwtPayload;
	roomId: string;
}

export type ChatMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const ChatAuthMiddleware = (jwtService: JwtService): ChatMiddleware => {
	return async (socket: AuthSocket, next) => {
		try {
			const cookies = socket.handshake.headers.cookie || '';
			const tokenCookie = parseCookieString(cookies);
			if (Object.keys(tokenCookie).length === 0)
				throw new Error('Could not find any cookies in the ws headers');
			const parsedTokenCookie = JSON.parse(tokenCookie['token']);
			const token = parsedTokenCookie['token'];
			if (!token) throw new Error('Token is undefined');

			const payload = <JwtPayload>jwtService.verify(token, { secret: config.jwt.secret });
			if (!payload?.id || !(payload?.role >= 0 && payload?.role <= 2))
				throw new Error('The jwt content is invalid');
			payload.id = new ObjectId(payload.id);

			const roomId = socket.handshake.auth.roomId;

			socket.roomId = roomId;
			socket.user = payload;
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
