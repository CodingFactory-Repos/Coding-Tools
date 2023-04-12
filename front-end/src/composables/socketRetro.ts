import { manager } from '@/utils/socket.io';
import { Socket } from 'socket.io-client';

export const state: { socket: Socket } = {
	socket: {} as Socket,
}


export function useSocket() {
	state.socket = manager.socket("/");

	return {
		socket: state.socket,
	}
}