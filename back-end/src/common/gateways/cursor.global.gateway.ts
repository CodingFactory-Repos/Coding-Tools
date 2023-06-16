import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { Inject, UseFilters, forwardRef } from '@nestjs/common';
import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';

import { WSServiceErrorCatcher } from '@/common/decorators/ws.catch.decorator';
import { AuthSocket, WSAuthMiddleware } from '@/common/middlewares/socket.auth.middleware';
import {
	ElementPosition,
} from '@/base/canvasRoom/interfaces/ws.canvasRoom.interface';
import { UsersRepository } from '@/base/users/users.repository';
import { ObjectId } from 'mongodb';

@UseFilters(WSServiceErrorCatcher)
@WebSocketGateway({
	transports: ['websocket'],
	cors: {
		origin: '*', // to be defined later
	},
	namespace: 'cursor',
})
export class CursorGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		private usersRepository: UsersRepository,
		private readonly jwtService: JwtService,
	) {}
	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		server.use(WSAuthMiddleware(this.jwtService));
	}

	async handleConnection(client: AuthSocket) {
		const query = { _id: client.user.id as ObjectId };
		const projection = { projection: { profile: { email: 1 } } };
		const user = await this.usersRepository.findOne(query, projection);

		client.join(client.roomId);
		client.join(client.user.id.toString());
		client.to(client.roomId).emit('peer-connected', client.id, user.profile.firstName);
	}

	async handleDisconnect(client: AuthSocket) {
		client.to(client.roomId).emit('peer-disconnected', client.id);
	}

	@SubscribeMessage('update-mouse-moved')
	handleMouseMoved(client: AuthSocket, position: ElementPosition) {
		client.to(client.roomId).emit('peer-mouse-moved', client.id, position);
	}

	@SubscribeMessage('connect-to-peer')
	handleConnectToPeer(client: AuthSocket, args: { peerId: string, firstName: string }) {
		client.to(args.peerId).emit('peer-connected', client.id, args.firstName, true);
	}
}
