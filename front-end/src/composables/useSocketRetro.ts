import { manager } from '@/api/network/socket.io';
import { Postits } from '@/store/interfaces/retrospective.interface';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { Manager, Socket } from 'socket.io-client';

function handleSocketEvents(socket: Socket) {
	const retrospectiveStore = useRetrospectiveStore();

	socket.on("peer-connected", (socket) => {
		console.log("ele", socket);
	})

	socket.on("postit-added", (postits: Postits) => {
		retrospectiveStore.currentRetro.postits = postits
	})
}


export const socketRetro: { socket: Socket } = {
socket: {} as Socket
}






export function useSocket(roomId) {
	socketRetro.socket =  manager.socket("/retrospective");
	socketRetro.socket.auth = { roomId: roomId };
	socketRetro.socket.connect();

	handleSocketEvents(socketRetro.socket)


	return {
		socket: socketRetro.socket,
	}
}