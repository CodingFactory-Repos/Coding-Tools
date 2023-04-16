import { Manager, ManagerOptions, Socket } from 'socket.io-client';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { Normalizer } from './normalyzer';
import { temporaryNotification } from '../utils/temporary.notification';
import { ElementBounds, ElementDimension, ElementPosition } from '../types/pixi-container';

export class SocketManager extends Manager {
	public readonly canvasSocket: Socket;
	public readonly peersId: Array<string>;
	protected readonly viewport: ViewportUI;

	constructor(uri: string, roomId: string, options: Partial<ManagerOptions>, viewport: ViewportUI) {
		super(uri, options);

		this.viewport = viewport;
		this.canvasSocket = this.socket('/canvas');
		this.canvasSocket.auth = { roomId };

		this.canvasSocket.on('peer-connected', (peerEmail: string) => {
			temporaryNotification("#42984b", "#ffffff", `${peerEmail} connected`);
		})

		this.canvasSocket.on('peer-disconnected', (peerEmail: string) => {
			temporaryNotification("#9e0000", "#ffffff", `${peerEmail} disconnected`);
		});

		this.canvasSocket.on('element-added', (container: SerializedContainer) => {
			const ctn = Normalizer.container(this.viewport, container, true);
			this.viewport.addChild(ctn)
		});

		this.canvasSocket.on('element-deleted', (uuid: string) => {
			try {
				const element = this.viewport.socketPlugin.elements[uuid];
				element.destroy();
			} catch(err) {
				if(err instanceof Error) {
					console.error(err.message);
				}
			}
		});


		this.canvasSocket.on('element-position-updated', (uuid: string, position: ElementPosition) => {
			try {
				const element = this.viewport.socketPlugin.elements[uuid];
				element.position.set(position.x, position.y);

				if(element.parent.parent)
				element.emit("moved", null);
			} catch(err) {
				if(err instanceof Error) {
					console.error(err.message);
				}
			}
		});

		this.canvasSocket.on('element-bounds-updated', (uuid: string, bounds: ElementBounds) => {
			try {
				const element = this.viewport.socketPlugin.elements[uuid];
				element.position.set(bounds.x, bounds.y);
				element.width = bounds.width;
				element.height = bounds.height;

				if(element.parent.parent)
					element.emit("moved", null);
			} catch(err) {
				if(err instanceof Error) {
					console.error(err.message);
				}
			}
		})

		this.canvasSocket.on('peer-mouse-updated', (peerId: string, position: ElementPosition) => {
			console.log(`Peer ${peerId} mouse mooved at position: ${position}`);
		})
	}

	public updateElementPosition(uuid: string, position: ElementPosition) {
		this.canvasSocket.emit('update-element-position', { uuid, position });
	}

	public updateElementBounds(uuid: string, bounds: ElementBounds) {
		this.canvasSocket.emit('update-element-bounds', { uuid, bounds });
	}

	public addElement(container: SerializedContainer) {
		this.canvasSocket.emit('add-element', container);
	}

	public deleteElement(uuid: string) {
		this.canvasSocket.emit('delete-element', uuid);
	}
}
