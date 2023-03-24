// import { Server } from 'socket.io';
// import express from 'express';
// import { createServer } from 'http';

// const app = express();
// const httpServer = createServer(app);
//
// httpServer.listen(5173);
// const io = new Server(httpServer);
function initializeChat(io) {
	const messages = [];
	io.on('connect', (socket) => {
		console.log('new connection');

		socket.on('message', (message) => {
			console.log(`new message: ${message}`);
			io.emit('message', message);
		});

		socket.on('disconnect', () => {
			console.log('disconnected');
		});

		socket.on('newMessage', (...args) => {
			// receive and sends a chat message
			console.log('newM');
			messages.unshift(args);
			console.log(messages);
			console.log('new message');
			socket.emit('chatMessage', messages[0]);
		});
	});
}
export default initializeChat;
