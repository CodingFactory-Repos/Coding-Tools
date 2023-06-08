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
import {
	MaterialSocket,
	MaterialAuthMiddleware,
} from '@/common/middlewares/socket.ideasComment.middleware';
// import { MaterialsRepository } from '@/base/materials/materials.repository';
import { IdeasCommentsRepository } from '@/base/ideasComments/ideasComments.repository';
import { IdeaComment } from '@/base/ideasComments/interfaces/ideasComments.interface';

@UseFilters(WSServiceErrorCatcher)
@WebSocketGateway({
	transports: ['websocket'],
	cors: {
		origin: '*', // to be defined later
	},
	namespace: 'ideasEquipements',
})
export class IdeasCommentGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		@Inject(forwardRef(() => IdeasCommentsRepository))
		private ideasCommentsRepository: IdeasCommentsRepository,
		// @Inject(forwardRef(() => UsersRepository))
		// private usersRepository: UsersRepository,
		private readonly jwtService: JwtService,
	) {}
	@WebSocketServer() server: Server;
	items = [];

	afterInit(server: Server) {
		server.use(MaterialAuthMiddleware(this.jwtService));
	}

	async handleConnection(client: MaterialSocket) {
		client.join(client.roomId);
		client.to(client.roomId).emit('peer-connected', client.id);
	}

	async handleDisconnect(client: MaterialSocket) {
		client.to(client.roomId).emit('peer-disconnected', client.id);
	}

	@SubscribeMessage('add-comment')
	async addComment(client: MaterialSocket, data: IdeaComment) {

		this.items.unshift(data);

		client.to(client.roomId).emit('comment-added', this.items[0]);
	}
}
