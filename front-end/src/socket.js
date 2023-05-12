import { reactive } from 'vue';
import { io } from 'socket.io-client';

// import { express } from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
//
// const app = express();
// const port = 3000;
//
// const server = createServer(app);
//
// const io = new Server(server, {
// 	cors: {
// 		origin: 'http://localhost:8080',
// 		// change origin to serv later
// 	},
// });

export const state = reactive({
	connected: false,
	messages: [],
});

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5173';

export const socket = io('http://localhost:5173/');

socket.on('connect', () => {
	state.connected = true;
});

socket.on('disconnect', () => {
	state.connected = false;
});

socket.on('message', (...args) => {
	state.messages.push(args);
});

// socket.on('getLatestMessage', () => {
// 	return state.messages[0];
// });
