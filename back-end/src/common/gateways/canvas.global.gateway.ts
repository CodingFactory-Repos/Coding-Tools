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

@UseFilters(WSServiceErrorCatcher)
@WebSocketGateway({
	transports: ['websocket'],
	cors: {
		origin: '*', // to be defined later
	},
	namespace: 'canvas',
})
export class CanvasGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject(forwardRef(() => CanvasRoomRepository))
		private canvasRoomRepository: CanvasRoomRepository,
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

		client.to(client.roomId).emit('peer-disconnected', user.profile.email);
	}

	@SubscribeMessage('update-element-position')
	handleElementUpdated(client: AuthSocket, data: { uuid: string; serializedBounds: SerializedContainerBounds }) {
		client.to(client.roomId).emit('element-bounds-updated', data.uuid, data.serializedBounds);

		const query = { _id: new ObjectId(client.roomId), 'project.uuid': data.uuid };
		const update = flatten({ "project.$": data.serializedBounds }, { array: true });

		for (let key in update["$set"]) {
			if (key.includes('uuid')) {
				delete update["$set"][key];
			}
		}

		this.canvasRoomRepository.updateOneCanvasRoom(query, update);
	}

	@SubscribeMessage('add-element')
	handleElementAdded(client: AuthSocket, container: SerializedContainer) {
		client.to(client.roomId).emit('element-added', container);

		const query = { _id: new ObjectId(client.roomId) };
		const update = { $push: { project: container } };
		this.canvasRoomRepository.updateOneCanvasRoom(query, update);
	}

	@SubscribeMessage('delete-element')
	handleElementDeleted(client: AuthSocket, uuid: string) {
		client.to(client.roomId).emit('element-deleted', uuid);

		const query = { _id: new ObjectId(client.roomId) };
		const update = { $pull: { project: { uuid: uuid } } };
		this.canvasRoomRepository.updateOneCanvasRoom(query, update);
	}

	@SubscribeMessage('update-element-bounds')
	handleElementUpdatedBounds(client: AuthSocket, data: { uuid: string; serializedBounds: SerializedContainerBounds }) {
		client.to(client.roomId).emit('element-bounds-updated', data.uuid, data.serializedBounds);

		const query = { _id: new ObjectId(client.roomId), 'project.uuid': data.uuid };
		const update = flatten({ "project.$": data.serializedBounds }, { array: true });

		for (let key in update["$set"]) {
			if (key.includes('uuid')) {
				delete update["$set"][key];
			}
		}

		this.canvasRoomRepository.updateOneCanvasRoom(query, update);
	}

	@SubscribeMessage('add-frame-children')
	handleChildrenFrameAdded(client: AuthSocket, data: { uuid: string, uuidChild: string, serialized: SerializedContainer }) {
		client.to(client.roomId).emit('frame-children-added', data.uuid, data.uuidChild, data.serialized.properties.frameNumber);

		const query = { _id: new ObjectId(client.roomId), 'project.uuid': data.uuid };
		const update = { $set: { "project.$": data.serialized } };

		const delQuery = { _id: new ObjectId(client.roomId) };
		const delUpdate = { $pull: { project: { uuid: data.uuidChild } } };

		this.canvasRoomRepository.updateOneCanvasRoom(query, update);
		this.canvasRoomRepository.updateOneCanvasRoom(delQuery, delUpdate)
	}

	@SubscribeMessage('remove-frame-children')
	handleChildrenFrameRemoved(client: AuthSocket, data: { uuid: string, serialized: SerializedContainer, serializedChild: SerializedContainer }) {
		client.to(client.roomId).emit('frame-children-removed', data.uuid, data.serializedChild.uuid);

		const query = { _id: new ObjectId(client.roomId), 'project.uuid': data.uuid };
		const update = { $set: { "project.$": data.serialized } };

		const updQuery = { _id: new ObjectId(client.roomId) };
		const updUpdate = { $push: { project: data.serializedChild } };

		this.canvasRoomRepository.updateOneCanvasRoom(query, update);
		this.canvasRoomRepository.updateOneCanvasRoom(updQuery, updUpdate)
	}

	@SubscribeMessage('update-mouse-moved')
	handleMouseMoved(client: AuthSocket, position: ElementPosition) {
		client.to(client.roomId).emit('peer-mouse-moved', client.id, position);
	}
}
