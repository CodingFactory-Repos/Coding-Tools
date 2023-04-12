import { Server } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

interface MousePosition {
	x: number;
	y: number;
	sceneId: string;
	userId: string;
}

@WebSocketGateway({
	namespace: '',
})
export class RetrospectivesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('AppGateway');

	private positions: MousePosition[] = [];

	afterInit(server: Server) {
		this.logger.log('Initialized');
	}

	handleConnection(client: any, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: any) {
		this.logger.log(`Client disconnected: ${client.id}`);

		const disconnectedUserIndex = this.positions.findIndex(position => position.userId === client.id);

		if (disconnectedUserIndex !== -1) {
			const sceneId = this.positions[disconnectedUserIndex].sceneId;
			this.positions.splice(disconnectedUserIndex, 1);

			this.server.to(sceneId).emit('positions', this.positions.filter(position => position.sceneId === sceneId));
		}
	}

	@SubscribeMessage('position')
	handlePosition(client: any, position: MousePosition) {
		// const existingUserIndex = this.positions.findIndex(p => p.userId === client.id);
		// console.log("exist", this.positions);
		// console.log("position", position);



		// if (existingUserIndex !== -1) {
		// 	this.positions[existingUserIndex] = position;
		// } else {
		// 	this.positions.push(position);
		// }

		// console.log("test", this.positions.filter(p => p.sceneId === position.sceneId));

		this.server.to(position.sceneId).emit('positions', {id: client.id, x: position.x, y: position.y});
		// this.server.local.to(position.sceneId).emit('positions', this.positions.filter(p => p.sceneId === position.sceneId));
	}

	@SubscribeMessage('joinScene')
	handleJoinScene(client: any, sceneId: string) {
		console.log("joinScene", sceneId);

		client.join(sceneId);

		// const scenePositions = this.positions.filter(p => p.sceneId === sceneId);
		// console.log("pos", scenePositions);
		// this.server.to(sceneId).emit('userJoined', client.id);

		// client.emit('positions', scenePositions);
	}


	// @SubscribeMessage('joinScene')
	// handlePositionUpdate(client: any, sceneId: string) {
	// 	console.log("joinScene", sceneId);

	// 	client.join(sceneId);

	// 	const scenePositions = this.positions.filter(p => p.sceneId === sceneId);
	// 	console.log("pos", scenePositions);
	// 	this.server.to(sceneId).emit('userJoined', client.id);

	// 	client.emit('positions', scenePositions);
	// }

	@SubscribeMessage('leaveScene')
	handleLeaveScene(client: any, sceneId: string) {
		client.leave(sceneId);

		const disconnectedUserIndex = this.positions.findIndex(position => position.userId === client.id && position.sceneId === sceneId);

		if (disconnectedUserIndex !== -1) {
			this.positions.splice(disconnectedUserIndex, 1);

			this.server.to(sceneId).emit('positions', this.positions.filter(position => position.sceneId === sceneId));
		}
	}
}
