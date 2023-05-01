import { utils } from 'pixi.js';
import { ManagerOptions } from 'socket.io-client';

import { ViewportUI } from '../viewportUI';
import { CanvasContainer } from '../types/pixi-aliases';
import { ElementPosition } from '../types/pixi-container';
import { SocketManager } from '../class/socketManager';
import { ModelGraphics } from '../types/pixi-class';
import { FramedContainer } from '../class/framedContainer';
import { GenericContainer } from '../class/genericContainer';
import { SerializedContainerBounds } from '../types/pixi-serialize';
import { SerializedContainer } from '../types/pixi-serialize';

interface CanvasSocketEvents {
	'ws-element-deleted': (uuid: string) => void;
	'ws-element-added': (element: CanvasContainer, isRemote: boolean) => void;
	'ws-element-dragged': (uuid: string, serializedBounds: SerializedContainerBounds) => void;
	'ws-element-resized': (uuid: string, serializedBounds: SerializedContainerBounds) => void;
	'ws-element-modified': () => void;
	'ws-mouse-moved': (position: ElementPosition) => void;
	'ws-frame-child-added': (uuid: string, uuidChild: string, serialized: SerializedContainer) => void;
	'ws-frame-child-removed': (uuid: string, serialized: SerializedContainer, serializedChild: SerializedContainer) => void;
}

export interface CanvasSocketOptions {
	uri: string;
	roomId: string;
	options: Partial<ManagerOptions>;
}

export class ViewportSocketPlugin extends utils.EventEmitter<CanvasSocketEvents> {
	protected readonly socketManager: SocketManager;
	public readonly elements: Record<string, CanvasContainer> | Record<string, ModelGraphics> = {};

	constructor(viewport: ViewportUI, socketOptions?: CanvasSocketOptions) {
		const { uri, roomId, options } = socketOptions;
		if (!uri) throw Error('Socket.io uri is required');

		super();

		this.socketManager = new SocketManager(uri, roomId, options, viewport);

		this.on('ws-element-added', (child, isRemote) => {
			if (!isRemote) {
				this.socketManager.addElement(child.serializeData());
			}
		});

		this.on('ws-element-dragged', (uuid, serializedBounds) => {
			this.socketManager.updateElementPosition(uuid, serializedBounds);
		});

		this.on('ws-element-deleted', (uuid) => {
			this.socketManager.deleteElement(uuid);
		});

		this.on('ws-element-resized', (uuid, serializedBounds) => {
			this.socketManager.updateElementBounds(uuid, serializedBounds);
		});

		this.on('ws-mouse-moved', (position) => {
			this.socketManager.updateMouseMoved(position);
		});

		this.on('ws-frame-child-added', (uuid, uuidChild, serialized) => {
			this.socketManager.updateFrameOnChildAdded(uuid, uuidChild, serialized);
		})

		this.on('ws-frame-child-removed', (uuid, serialized, serializedChild) => {
			this.socketManager.updateFrameOnChildRemoved(uuid, serialized, serializedChild);
		})
	}

	public disconnect() {
		this.socketManager._close();
	}

	public trackElementByUUID(container: GenericContainer | FramedContainer) {
		if (container instanceof FramedContainer) {
			this.elements[container.uuid] = container;

			for (const element of container.mainContainer.children) {
				if (element instanceof GenericContainer) {
					this.elements[element.uuid] = element;
					const genericChild = element.getGraphicChildren()[0];
					this.elements[genericChild.uuid] = genericChild;
				} else {
					this.elements[element.uuid] = element;
				}
			}
			return;
		}

		if (container instanceof GenericContainer) {
			this.elements[container.uuid] = container;
			const genericChild = container.getGraphicChildren()[0];
			this.elements[genericChild.uuid] = genericChild;
		}
	}

	public pruneDestroyedElements() {
		for(const key in this.elements) {
			if(this.elements[key].destroyed) {
				delete this.elements[key];
			}
		}
	}
}
