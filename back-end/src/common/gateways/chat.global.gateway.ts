import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { AuthSocket, ChatAuthMiddleware } from '@/common/middlewares/socket.chat.middleware';

@WebSocketGateway({
	transports: ['websocket'],
	cors: {
		origin: '*',
	},
	namespace: 'chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly jwtService: JwtService) {}
	@WebSocketServer() server: Server;
	messages = [];

	afterInit(server: Server) {
		server.use(ChatAuthMiddleware(this.jwtService));
	}
	@SubscribeMessage('message')
	async handleMessage(client: AuthSocket, args) {
		console.log(30, args);
		this.messages.unshift(args);
		console.log(32, this.messages[0]);
		client.to(client.roomId).emit('peer-chat-message', this.messages[0]);
	}

	async handleConnection(client: AuthSocket) {
		client.join(client.roomId);
		client.to(client.roomId).emit('peer-connected', client.id);
	}

	handleDisconnect(client: AuthSocket): any {
		client.to(client.roomId).emit('peer-disconnected', client.id);
	}
}
