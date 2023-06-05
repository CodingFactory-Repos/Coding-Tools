import { Manager } from 'socket.io-client';

export const manager = new Manager('wss://codingtools.loule.me', {
	transports: ['websocket'],
	withCredentials: true,
	path: '/socket.io',
});
