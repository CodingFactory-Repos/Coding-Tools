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
import { CanvasRoomRepository } from '@/base/canvasRoom/canvasRoom.repository';
import {
	ElementPosition,
	SerializedContainer,
	SerializedContainerBounds,
} from '@/base/canvasRoom/interfaces/ws.canvasRoom.interface';
import { UsersRepository } from '@/base/users/users.repository';
import { ObjectId } from 'mongodb';
import { flatten } from 'mongo-dot-notation';
import { RetrospectivesRepository } from '@/base/retrospectives/retrospectives.repository';
import { Postit, Retrospective } from '@/base/retrospectives/interfaces/retrospectives.interface';

@UseFilters(WSServiceErrorCatcher)
@WebSocketGateway({
	transports: ['websocket'],
	cors: {
		origin: '*', // to be defined later
	},
	namespace: 'retrospective',
})
export class RetrospectiveGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject(forwardRef(() => RetrospectivesRepository))
		private retrospectivesRepository: RetrospectivesRepository,
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
		console.log("bonjour");
		console.log("client", client.roomId);




		client.join(client.roomId);
		client.to(client.roomId).emit('peer-connected', user.profile.email);
	}

	async handleDisconnect(client: AuthSocket) {
		const query = { _id: client.user.id as ObjectId };
		const projection = { projection: { profile: { email: 1 } } };
		const user = await this.usersRepository.findOne(query, projection);

		client.to(client.roomId).emit('peer-disconnected', user.profile.email);
	}
	@SubscribeMessage('add-postit')
	handlePostitAdded(client: AuthSocket, currentRetro: Retrospective) {
		client.to(client.roomId).emit('postit-added', currentRetro.postits);

		const postits = currentRetro.postits;
		const query = { slug: client.roomId };
		const update = { $set: { postits: postits } };

		this.retrospectivesRepository.updateOneRetrospective(query, update);
	}

	@SubscribeMessage('delete-postit')
	handlePostitDeleted(client: AuthSocket, postit: Postit) {
		client.to(client.roomId).emit('postit-deleted', postit);

		const query = { slug: client.roomId };
		const update = { $pull: { [`postits.${postit.type}`] : {id:  postit.id}} } ;

		this.retrospectivesRepository.updateOneRetrospective(query, update);
	}

	@SubscribeMessage('update-postit')
	handlePostitUpdated(client: AuthSocket, postit: Postit) {
		client.to(client.roomId).emit('postit-updated', postit);

		const query = { slug: client.roomId,  [`postits.${postit.type}.id`] : postit.id };
		const update = { $set: { [`postits.${postit.type}.$.value`]: postit.value }};
		this.retrospectivesRepository.updateOneRetrospective(query, update);
	}

	@SubscribeMessage('update-mouse-moved')
	handleMouseMoved(client: AuthSocket, position: ElementPosition) {
		client.to(client.roomId).emit('peer-mouse-moved', client.id, position);
	}
}
