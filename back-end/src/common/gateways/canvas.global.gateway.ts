import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { Inject, UseFilters, forwardRef } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';

import { WSServiceErrorCatcher } from '@/common/decorators/ws.catch.decorator';
import { AuthSocket, WSAuthMiddleware } from '@/common/middlewares/socket.auth.middleware';
import { CanvasRoomRepository } from '@/base/canvasRoom/canvasRoom.repository';
import { ElementBounds, SerializedContainer } from '@/base/canvasRoom/interfaces/canvasRoom.interface';
import { UsersRepository } from '@/base/users/users.repository';
import { ObjectId } from 'mongodb';

@UseFilters(WSServiceErrorCatcher)
@WebSocketGateway({
	transports: ['websocket'],
	cors: {
		origin: '*', // to be defined later
	},
	namespace: "canvas",
})
export class CanvasGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject(forwardRef(() => CanvasRoomRepository))
		private canvasRoomRepository: CanvasRoomRepository,
		@Inject(forwardRef(() => UsersRepository))
		private usersRepository: UsersRepository,
		private readonly jwtService: JwtService
	) {}
	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		server.use(WSAuthMiddleware(this.jwtService));
	}

	async handleConnection(client: AuthSocket) {
		const query = { _id: client.user.id as ObjectId };
		const projection = { projection: { profile: { email: 1 } } }
		const user = await this.usersRepository.findOne(query, projection);

		client.join(client.roomId);
		client.to(client.roomId).emit('peer-connected', user.profile.email);
		console.log("connected");
	}

	async handleDisconnect(client: AuthSocket) {
		const query = { _id: client.user.id as ObjectId };
		const projection = { projection: { profile: { email: 1 } } }
		const user = await this.usersRepository.findOne(query, projection);

		client.to(client.roomId).emit('peer-disconnected', user.profile.email);
		console.log("disconnected");
	}

	@SubscribeMessage('update-element-position')
	handleElementUpdated(client: AuthSocket, data: { uuid: string, position: ElementBounds}) {
		client.to(client.roomId).emit('element-position-updated', data.uuid, data.position);
		console.log("element moved");
	}

	@SubscribeMessage('add-element')
	handleElementAdded(client: AuthSocket, container: SerializedContainer) {
		console.log(container)
		client.to(client.roomId).emit('element-added', container);
		console.log("element added");
	}

	@SubscribeMessage('delete-element')
	handleElementDeleted(client: AuthSocket, uuid: string) {
		client.to(client.roomId).emit('element-deleted', uuid);
	}

	@SubscribeMessage('update-element-bounds')
	handleElementUpdatedBounds(client: AuthSocket, data: { uuid: string, bounds: ElementBounds }) {
		console.log(data.bounds)
		client.to(client.roomId).emit('element-bounds-updated', data.uuid, data.bounds);
		console.log("element resized");
	}


	// public updateElementPosition(id: string, position: ElementPosition): void {
	// 	this.canvasSocket.emit('update-element-position', { id, position });
	// }

	// public addElement(id: string, position: ElementPosition): void {
	// 	this.canvasSocket.emit('add-element', { id, position });
	// }

	// public deleteElement(id: string): void {
	// 	this.canvasSocket.emit('delete-element', id);
	// }


	// this.canvasSocket.on('element-added', (data: any) => {
	// 	console.log(`Element ${data} added`);
	// });

	// this.canvasSocket.on('element-deleted', (data: any) => {
	// 	console.log(`Element ${data} deleted`);
	// });

	// this.canvasSocket.on('element-position-updated', (data: any) => {
	// 	console.log(`Element ${data.id} position updated`);
	// });

	// this.canvasSocket.on('peer-mouse-updated', (peerId: string, data: any) => {
	// 	console.log(`Peer ${peerId} mouse mooved at position: ${data}`);
	// })
}