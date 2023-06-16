import { Manager, ManagerOptions, Socket } from 'socket.io-client';
import { ElementPosition } from '../types/pixi-container';
import { ViewportCursor } from '../viewportCursor';

export class SocketCursorManager extends Manager {
	public readonly canvasSocket: Socket;
	public readonly peersId: Array<string>;
	protected readonly viewport: ViewportCursor;

	constructor(uri: string, roomId: string, options: Partial<ManagerOptions>, viewport: ViewportCursor, firstName: string) {
		super(uri, options);

		this.viewport = viewport;
		this.canvasSocket = this.socket('/cursor');
		this.canvasSocket.auth = { roomId };

		this.canvasSocket.on('peer-connected', (peerId: string, peerFirstName: string, forced: boolean = false) => {
			this.viewport.addCursorElement(peerId, peerFirstName, { x: 0, y: 0 });
			
			if(!forced) {
				this.canvasSocket.emit('connect-to-peer', { peerId, firstName });
			}
		});

		this.canvasSocket.on('peer-disconnected', (peerId: string) => {
			const element = this.viewport.cursorElements[peerId];
			if(element !== undefined) {
				this.viewport.removeChild(element);
				element.destroy();
			}
		});

		this.canvasSocket.on('peer-mouse-moved', (peerId: string, position: ElementPosition) => {
			const element = this.viewport.cursorElements[peerId];
			if(element !== undefined) {
				this.viewport.updateCursorElement(element, position);
			}
		});
	}

	public updateMouseMoved(position: ElementPosition) {
		this.canvasSocket.emit('update-mouse-moved', position);
	}
}
