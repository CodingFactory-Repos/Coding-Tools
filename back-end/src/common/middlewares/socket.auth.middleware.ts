import { Socket } from 'socket.io';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';

import { config } from '@/config/config';
import { WSServiceError } from '@/common/decorators/ws.catch.decorator';
import { JwtPayload } from '@/auth/interfaces/jwt.interface';
import { parseCookieString } from '@/common/helpers/string.helper';
import { Logger as NestLogger } from '@nestjs/common';
import { CanvasRoomRepository } from '@/base/canvasRoom/canvasRoom.repository';

export interface AuthSocket extends Socket {
	user: JwtPayload;
	roomId: string;
}

export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void

export const WSAuthMiddleware = (jwtService: JwtService): SocketMiddleware =>{
	return async (socket: AuthSocket, next) => {
		try {
			const cookies = socket.handshake.headers.cookie || '';
			const tokenCookie = parseCookieString(cookies);
			if(Object.keys(tokenCookie).length === 0)
				throw new Error("Could not find any cookies in the ws headers");
			
			const parsedTokenCookie = JSON.parse(tokenCookie["token"]);
			const token = parsedTokenCookie["token"];
			if (!token)
				throw new Error("Token is undefined");

			const payload = <JwtPayload> jwtService.verify(token, { secret: config.jwt.secret });
			if (!payload?.id || !(payload?.role >= 0 && payload?.role <= 2))
				throw new Error("The jwt content is invalid");
			payload.id = new ObjectId(payload.id);

			const roomId = socket.handshake.auth.roomId;
			// const canvasRoom = await canvasRoomRepository.findOneCanvasRoom({ _id: new ObjectId(roomId), allowedPeers: { $in: [payload.id] }});
			// if(canvasRoom === null)
			// 	throw new WSServiceError("UNAUTHORIZED", "The canvas room was not found");

			socket.roomId = roomId;
			socket.user = payload;
			next();
		} catch(err) {
			if(err instanceof Error) {
				NestLogger.error(err.message);
			}

			next(new WSServiceError("UNAUTHORIZED", "You do not have the rights to access this ressource"));
		}
	}
}