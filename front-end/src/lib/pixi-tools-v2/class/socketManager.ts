import { Manager, ManagerOptions, Socket } from 'socket.io-client';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer, SerializedContainerBounds } from '../types/pixi-serialize';
import { Normalizer } from './normalyzer';
import { temporaryNotification } from '../utils/temporary.notification';
import { ElementPosition } from '../types/pixi-container';
import { GenericContainer } from './genericContainer';
import { FramedContainer } from './framedContainer';
import { CanvasContainer } from '../types/pixi-aliases';


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
			temporaryNotification('#42984b', '#ffffff', `${peerEmail} connected`);
		});

		this.canvasSocket.on('peer-disconnected', (peerEmail: string) => {
			temporaryNotification('#9e0000', '#ffffff', `${peerEmail} disconnected`);
		});

		this.canvasSocket.on('element-added', (container: SerializedContainer) => {
			const ctn = Normalizer.container(this.viewport, container, true);
			this.viewport.addChild(ctn);
		});

		this.canvasSocket.on('element-deleted', (uuid: string) => {
			try {
				this.viewport.socketPlugin.elements[uuid].destroy();
				
				const uuidDestroyed: Array<string> = [];
				for(const key in this.viewport.socketPlugin.elements) {
					const { uuid, destroyed } = this.viewport.socketPlugin.elements[key];
					if(destroyed) uuidDestroyed.push(uuid);
				}

				for(let n = 0; n < uuidDestroyed.length; n++) {
					delete this.viewport.socketPlugin.elements[uuidDestroyed[n]];
				}
			} catch (err) {
				if (err instanceof Error) {
					console.error(err.message);
				}
			}
		});

		this.canvasSocket.on('element-bounds-updated', (uuid: string, serializedBounds: SerializedContainerBounds) => {
			this._updateTreeBounds(uuid, serializedBounds)
		});

		this.canvasSocket.on('frame-children-added', (uuid: string, uuidChild: string, frameNumber: number) => {
			try {
				const frame = this.viewport.socketPlugin.elements[uuid] as FramedContainer;
				const children = this.viewport.socketPlugin.elements[uuidChild] as CanvasContainer;

				frame.addNestedChild(children, frameNumber, true);
			} catch(err) {
				if (err instanceof Error) {
					console.error(err.message);
				}
			}
		});

		this.canvasSocket.on('frame-children-removed', (uuid: string, uuidChild: string) => {
			try {
				const frame = this.viewport.socketPlugin.elements[uuid] as FramedContainer;
				const children = this.viewport.socketPlugin.elements[uuidChild] as CanvasContainer;

				frame.removeNestedChild(children, this.viewport.children.length, true);
			} catch(err) {
				if (err instanceof Error) {
					console.error(err.message);
				}
			}
		});

		this.canvasSocket.on('peer-mouse-moved', (peerId: string, position: ElementPosition) => {
			console.log(`Peer ${peerId} mouse mooved at position: ${position.x},${position.y}`);
		});
	}

	private _updateTreeBounds(uuid: string, serializedBounds: SerializedContainerBounds) {
		try {
			const element = this.viewport.socketPlugin.elements[uuid];
			if(element instanceof FramedContainer) {
				element.updateTreeBounds(serializedBounds);

				for(const container of serializedBounds.childs) {
					this._updateTreeBounds(container.uuid, container as SerializedContainerBounds);
				}
			} else if(element instanceof GenericContainer) {
				element.updateTreeBounds(serializedBounds);
			}

			element.emit('moved', null);
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
			}
		}
	}

	public updateElementBounds(uuid: string, serializedBounds: SerializedContainerBounds) {
		this.canvasSocket.emit('update-element-bounds', { uuid, serializedBounds });
	}

	public addElement(container: SerializedContainer) {
		this.canvasSocket.emit('add-element', container);
	}

	public deleteElement(uuid: string, uuidFrame: string) {
		this.canvasSocket.emit('delete-element', { uuid, uuidFrame });
	}

	public updateMouseMoved(position: ElementPosition) {
		this.canvasSocket.emit('update-mouse-moved', position);
	}

	public updateFrameOnChildAdded(uuid: string, uuidChild: string, serialized: SerializedContainer) {
		this.canvasSocket.emit('add-frame-children', { uuid, uuidChild, serialized });
	}

	public updateFrameOnChildRemoved(uuid: string, serialized: SerializedContainer, serializedChild: SerializedContainer) {
		this.canvasSocket.emit('remove-frame-children', { uuid, serialized, serializedChild });
	}
}
