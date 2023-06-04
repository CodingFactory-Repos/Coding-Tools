import { JwtPayload } from '@/auth/interfaces/jwt.interface';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';

import { parseCookieString } from '@/common/helpers/string.helper';
import { config } from '@/config/config';
import { Logger as NestLogger } from '@nestjs/common';
import { WSServiceError } from '@/common/decorators/ws.catch.decorator'; // C CV

export interface AuthSocket extends Socket {
	user: JwtPayload;
	roomId: string;
}

export type ChatMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const ChatAuthMiddleware = (jwtService: JwtService): ChatMiddleware => {
	return (socket: AuthSocket, next) => {
		try {
			const chatCookies = socket.handshake.headers.cookie || '';
			const tokenChatCookie = parseCookieString(chatCookies);
			if (Object.keys(tokenChatCookie).length === 0)
				throw new Error('Could not find any cookies in the ws headers');
			const parsedTokenCookie = JSON.parse(tokenChatCookie['token']);
			const chatToken = parsedTokenCookie['token'];
			if (!chatToken) throw new Error('Token is undefined');

			const chatPayload = <JwtPayload>jwtService.verify(chatToken, { secret: config.jwt.secret });
			if (!chatPayload?.id || !(chatPayload?.role >= 0 && chatPayload?.role <= 2))
				throw new Error('The jwt content is invalid');
			chatPayload.id = new ObjectId(chatPayload.id);

			const roomId = socket.handshake.auth.roomId;

			socket.roomId = roomId;
			socket.user = chatPayload;
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
