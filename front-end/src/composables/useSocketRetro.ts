import { manager } from '@/api/network/socket.io';
import { Postit, Postits } from '@/store/interfaces/retrospective.interface';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { Socket } from 'socket.io-client';
import Swal from 'sweetalert2';

function handleSocketEvents(socket: Socket) {
	const retrospectiveStore = useRetrospectiveStore();

	socket.on('peer-connected', (email) => {
		Swal.fire({
			position: 'top-end',
			text: `${email} has joined`,
			showConfirmButton: false,
			timer: 1500,
			color: '#40c060',
			padding: '0em',
			toast: true,
		});
		retrospectiveStore.participantJoin(email);
	});

	socket.on('postit-added', (postits: Postits) => {
		retrospectiveStore.currentRetro.postits = postits;
	});

	socket.on('postit-deleted', (postit: Postit) => {
		retrospectiveStore.removeFromSocket(postit);
	});

	socket.on('postit-updated', (postit: Postit) => {
		retrospectiveStore.updateFromSocket(postit);
	});

	socket.on('peer-mouse-moved', (userCursor) => {
		retrospectiveStore.updateUserCursor(userCursor);
	});

	socket.on('peer-disconnected', (user) => {
		Swal.fire({
			position: 'top-end',
			text: `${user.email} has left`,
			showConfirmButton: false,
			timer: 1500,
			color: '#d33',
			padding: '0em',
			toast: true,
		});
		retrospectiveStore.removeCursor(user);
		retrospectiveStore.participantLeave(user);
	});

	socket.on('end-currentRetro', (endeDate) => {
		retrospectiveStore.endCurrentRetro(endeDate);
	});

	socket.on('lock-retro', (lock) => {
		retrospectiveStore.lockRetro(lock);
	});

	// @@@@@@@@@@@ TIMER SECTION @@@@@@@@@

	socket.on('start-timer', () => {
		retrospectiveStore.runningTimer();
	});

	socket.on('progess-timer', (time) => {
		retrospectiveStore.progressTimer(time);
	});

	socket.on('pause-timer', () => {
		retrospectiveStore.stopingTimer();
	});

	socket.on('reset-timer', () => {
		retrospectiveStore.resetRetro();
		retrospectiveStore.resetTimer();
	});

	// @@@@@@@@@@@ END TIMER SECTION @@@@@@@@@

	socket.on("update-visibility", (postits: Postits) => {
		retrospectiveStore.setSocketVisibility(postits)
	})

}

export const socketRetro: { socket: Socket } = {
	socket: {} as Socket,
};

export function useSocket(roomId: string) {
	socketRetro.socket = manager.socket('/retrospective');
	socketRetro.socket.auth = { roomId: roomId };
	socketRetro.socket.connect();

	handleSocketEvents(socketRetro.socket);

	return {
		socket: socketRetro.socket,
	};
}
