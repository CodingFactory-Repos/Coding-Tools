import { config } from '@/config/config';
import { Manager } from 'socket.io-client';

export const manager = new Manager(config.socket.url, {
	transports: ['websocket'],
	withCredentials: true,
	path: '/socket.io',
});
