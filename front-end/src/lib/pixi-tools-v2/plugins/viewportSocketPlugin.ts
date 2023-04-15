import { utils } from "pixi.js";
import { ManagerOptions } from "socket.io-client";

import { ViewportUI } from "../viewportUI";
import { CanvasContainer } from "../types/pixi-aliases";
import { ElementPosition } from "../types/pixi-container";
import { SocketManager } from "../class/socketManager";

interface CanvasSocketEvents {
	"ws-element-deleted": (uuid: string) => void;
	"ws-element-added": (element: CanvasContainer, isRemote: boolean) => void;
	"ws-element-dragged": (uuid: string, position: ElementPosition) => void;
	"ws-element-resized": () => void;
	"ws-element-modified": () => void;
}

export interface CanvasSocketOptions {
	uri: string,
	roomId: string,
	options: Partial<ManagerOptions>
}

export class ViewportSocketPlugin extends utils.EventEmitter<CanvasSocketEvents> {
	protected readonly socketManager: SocketManager;

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
	}

	public disconnect() {
		this.socketManager._close();
	}
}