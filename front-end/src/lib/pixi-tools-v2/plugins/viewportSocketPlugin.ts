import { utils } from 'pixi.js';
import { ManagerOptions } from 'socket.io-client';

import { ViewportUI } from '../viewportUI';
import { CanvasContainer } from '../types/pixi-aliases';
import { ElementPosition } from '../types/pixi-container';
import { SocketManager } from '../class/socketManager';
import { ModelGraphics } from '../types/pixi-class';
import { FramedContainer } from '../class/framedContainer';
import { GenericContainer } from '../class/genericContainer';
import {
	SerializedContainerBounds,
	SerializedContainer,
	SerializedControl,
	SerializedColorimetry,
} from '../types/pixi-serialize';
import { LineContainer } from '../class/lineContainer';
import { TextContainer } from '../class/textContainer';

interface CanvasSocketEvents {
	'ws-element-deleted': (uuid: string, uuidFrame?: string) => void;
	'ws-element-added': (serialized: SerializedContainer) => void;
	'ws-element-updated': (uuid: string, serializedBounds: SerializedContainerBounds) => void;
	'ws-line-updated': (uuid: string, serializedBounds: SerializedControl) => void;
	'ws-element-modified': () => void;
	'ws-mouse-moved': (position: ElementPosition) => void;
	'ws-frame-child-added': (
		uuid: string,
		uuidChild: string,
		serialized: SerializedContainer,
	) => void;
	'ws-frame-child-removed': (
		uuid: string,
		serialized: SerializedContainer,
		serializedChild: SerializedContainer,
	) => void;
	'ws-element-colorized': (uuid: string, serializedColor: SerializedColorimetry) => void;
}

export interface CanvasSocketOptions {
	uri: string;
	roomId: string;
	options: Partial<ManagerOptions>;
}

export class ViewportSocketPlugin extends utils.EventEmitter<CanvasSocketEvents> {
	protected readonly socketManager: SocketManager;
	public readonly elements:
		| Record<string, CanvasContainer>
		| Record<string, ModelGraphics>
		| Record<string, TextContainer>
		| Record<string, LineContainer> = {};

	constructor(viewport: ViewportUI, socketOptions?: CanvasSocketOptions) {
		const { uri, roomId, options } = socketOptions;
		if (!uri) throw Error('Socket.io uri is required');
		super();

		this.socketManager = new SocketManager(uri, roomId, options, viewport);

		this.on('ws-element-added', (serialized) => {
			this.socketManager.addElement(serialized);
		});

		this.on('ws-element-deleted', (uuid, uuidFrame) => {
			this.socketManager.deleteElement(uuid, uuidFrame);
		});

		this.on('ws-element-updated', (uuid, serializedBounds) => {
			this.socketManager.updateElementBounds(uuid, serializedBounds);
		});

		this.on('ws-mouse-moved', (position) => {
			this.socketManager.updateMouseMoved(position);
		});

		this.on('ws-frame-child-added', (uuid, uuidChild, serialized) => {
			this.socketManager.updateFrameOnChildAdded(uuid, uuidChild, serialized);
		});

		this.on('ws-frame-child-removed', (uuid, serialized, serializedChild) => {
			this.socketManager.updateFrameOnChildRemoved(uuid, serialized, serializedChild);
		});

		this.on('ws-line-updated', (uuid, serializedControl) => {
			this.socketManager.updateLineControls(uuid, serializedControl);
		});

		this.on('ws-element-colorized', (uuid, serializedColorimetry) => {
			this.socketManager.updateColorimetry(uuid, serializedColorimetry);
		});
	}

	public disconnect() {
		this.socketManager._close();
	}

	public trackElementByUUID(container: GenericContainer | FramedContainer | LineContainer) {
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

			// TODO: Thomas, you need to support the TextContainer tracking when it's inside the generic container
		}

		if (container instanceof LineContainer) {
			this.elements[container.uuid] = container;
			const child = container.children[0];
			this.elements[child.uuid] = child;
		}

		if (container instanceof TextContainer) {
			this.elements[container.uuid] = container;
			const child = container.children[0];
			this.elements[child.uuid] = child;
		}
	}

	public pruneDestroyedElements() {
		for (const key in this.elements) {
			if (this.elements[key].destroyed) {
				delete this.elements[key];
			}
		}
	}
}
