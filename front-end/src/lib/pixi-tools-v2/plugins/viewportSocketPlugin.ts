import { utils } from "pixi.js";
import { ManagerOptions } from "socket.io-client";

import { ViewportUI } from "../viewportUI";
import { CanvasContainer } from "../types/pixi-aliases";
import { ElementBounds, ElementPosition } from "../types/pixi-container";
import { SocketManager } from "../class/socketManager";
import { ModelGraphics } from "../types/pixi-class";
import { FramedContainer } from "../class/framedContainer";
import { GenericContainer } from "../class/genericContainer";

interface CanvasSocketEvents {
	"ws-element-deleted": (uuid: string) => void;
	"ws-element-added": (element: CanvasContainer, isRemote: boolean) => void;
	"ws-element-dragged": (uuid: string, position: ElementPosition) => void;
	"ws-element-resized": (uuid: string, bounds: ElementBounds) => void;
	"ws-element-modified": () => void;
	"ws-mouse-moved": (position: ElementPosition) => void;
}

export interface CanvasSocketOptions {
	uri: string,
	roomId: string,
	options: Partial<ManagerOptions>
}

export class ViewportSocketPlugin extends utils.EventEmitter<CanvasSocketEvents> {
	protected readonly socketManager: SocketManager;
	public readonly elements: Record<string, CanvasContainer> | Record<string, ModelGraphics> = {};

	constructor(viewport: ViewportUI, socketOptions?: CanvasSocketOptions) {
		const { uri, roomId, options } = socketOptions;
		if(!uri) throw Error("Socket.io uri is required");

		super();

		this.socketManager = new SocketManager(uri, roomId, options, viewport);

		this.on('ws-element-added', (child, isRemote) => {
			if(!isRemote) {
				this.socketManager.addElement(child.serializeData());
			}
		})

		this.on('ws-element-dragged', (uuid, position) => {
			this.socketManager.updateElementPosition(uuid, position);
		})

		this.on('ws-element-deleted', (uuid) => {
			this.socketManager.deleteElement(uuid);
		})

		this.on('ws-element-resized', (uuid, bounds) => {
			this.socketManager.updateElementBounds(uuid, bounds);
		})

		this.on('ws-mouse-moved', (position) => {
			this.socketManager.updateMouseMoved(position);
		})
	}

	public disconnect() {
		this.socketManager._close();
	}

	public trackElementByUUID(container: GenericContainer | FramedContainer) {
		if(container instanceof FramedContainer) {
			this.elements[container.uuid] = container;
		
			for(let n = 0; n < container.mainContainer.children.length; n++) {
				const subChild = container.mainContainer.children[n];

				if(subChild instanceof GenericContainer) {
					this.elements[subChild.uuid] = subChild;
					const genericChild = subChild.getGraphicChildren()[0];
					this.elements[genericChild.uuid] = genericChild;
				} else {
					this.elements[subChild.uuid] = subChild;
				}
			}
			return;
		}

		if(container instanceof GenericContainer) {
			this.elements[container.uuid] =  container;
			const genericChild = container.getGraphicChildren()[0];
			this.elements[genericChild.uuid] =  genericChild;
		}
	}

	public pruneDestroyedElements() {
		const keys = Object.keys(this.elements);
		for (let n = 0; n < keys.length; n++) {
			if(this.elements[keys[n]].destroyed) {
				delete this.elements[keys[n]];
			}
		}
	}
}