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
import { ElementPosition } from '@/base/canvasRoom/interfaces/ws.canvasRoom.interface';
import { UsersRepository } from '@/base/users/users.repository';
import { ObjectId } from 'mongodb';
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
export class RetrospectiveGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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

		client.join(client.roomId);
		client.to(client.roomId).emit('peer-connected', user.profile.email);
	}

	async handleDisconnect(client: AuthSocket) {
		const query = { _id: client.user.id as ObjectId };
		const projection = { projection: { profile: { email: 1 } } };
		const user = await this.usersRepository.findOne(query, projection);

		const userDisconnected = {
			email: user.profile.email,
			id: client.id,
		};

		client.to(client.roomId).emit('peer-disconnected', userDisconnected);
	}
	@SubscribeMessage('add-postit')
	async handlePostitAdded(client: AuthSocket, currentRetro: Retrospective) {
		client.to(client.roomId).emit('postit-added', currentRetro.postits);

		const postits = currentRetro.postits;
		const query = { slug: client.roomId };
		const update = { $set: { postits: postits } };

		await this.retrospectivesRepository.updateOneRetrospective(query, update);
	}

	@SubscribeMessage('delete-postit')
	async handlePostitDeleted(client: AuthSocket, postit: Postit) {
		client.to(client.roomId).emit('postit-deleted', postit);

		const query = { slug: client.roomId };
		const update = { $pull: { [`postits.${postit.type}`]: { id: postit.id } } };

		await this.retrospectivesRepository.updateOneRetrospective(query, update);
	}

	@SubscribeMessage('update-postit')
	async handlePostitUpdated(client: AuthSocket, postit: Postit) {
		client.to(client.roomId).emit('postit-updated', postit);

		const query = { slug: client.roomId, [`postits.${postit.type}.id`]: postit.id };
		const update = { $set: { [`postits.${postit.type}.$.value`]: postit.value } };
		await this.retrospectivesRepository.updateOneRetrospective(query, update);
	}

	@SubscribeMessage('update-mouse-moved')
	handleMouseMoved(client: AuthSocket, position: ElementPosition) {
		const returnData = {
			position,
			clientId: client.id,
		};
		client.to(client.roomId).emit('peer-mouse-moved', returnData);
	}


	@SubscribeMessage('end-currentRetro')
	async endCurrentRetro(client: AuthSocket) {
		const endedDate = new Date();
		client.to(client.roomId).emit('end-currentRetro', endedDate);

		const query = { slug: client.roomId };
		const update = {$set: { endedAt: endedDate, isRetroEnded: true}}

		await this.retrospectivesRepository.updateOneRetrospective(query, update);
	}
	@SubscribeMessage('lock-retro')
	async lockCurrentRetro(client: AuthSocket, lock: boolean) {
		client.to(client.roomId).emit('lock-retro', lock);
		const query = { slug: client.roomId };
		const update = {$set: { isLocked: lock }}

		await this.retrospectivesRepository.updateOneRetrospective(query, update);
	}

	//@@@@@@@@@@@ TIMER SECTION @@@@@@@@@@@@@@@

	@SubscribeMessage('start-timer')
	startTimer(client: AuthSocket) {
		client.to(client.roomId).emit('start-timer');
	}

	@SubscribeMessage('pause-timer')
	pauseTimer(client: AuthSocket) {
		client.to(client.roomId).emit('pause-timer');
	}

	@SubscribeMessage('reset-timer')
	async resetTimer(client: AuthSocket) {
		const query = { _id: client.user.id as ObjectId };
		const user = await this.usersRepository.findOne(query);
		const queryRetro = { slug: client.roomId };
		const currentRetro = await this.retrospectivesRepository.findOne(queryRetro);

		const update = {$set: { endedAt: null, isRetroEnded: false}}


		if ((user.role === 2 || user.role === 3) && currentRetro.isRetroEnded) {
			await this.retrospectivesRepository.updateOneRetrospective(currentRetro, update);
			client.to(client.roomId).emit('reset-timer');
		}
		if (user.role === 1 && !currentRetro.isRetroEnded) {
			client.to(client.roomId).emit('reset-timer');
		}

	}

	//@@@@@@@@@@@ END TIMER SECTION @@@@@@@@@@@@@@@

}
