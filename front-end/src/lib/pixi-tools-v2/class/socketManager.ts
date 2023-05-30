import { Manager, ManagerOptions, Socket } from 'socket.io-client';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer, SerializedContainerBounds, SerializedControl, SerializedColorimetry, SerializedGraphicColorimetry } from '../types/pixi-serialize';
import { Normalizer } from './normalyzer';
import { temporaryNotification } from '../utils/temporary.notification';
import { ElementPosition } from '../types/pixi-container';
import { GenericContainer } from './genericContainer';
import { FramedContainer } from './framedContainer';
import { CanvasContainer } from '../types/pixi-aliases';
import { LineContainer } from './lineContainer';
import { Rectangle } from '../model/template';
import { useRouter } from 'vue-router';

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

		this.canvasSocket.on('access-lost', () => {
			temporaryNotification('#9e0000', '#ffffff', `The owner of the project removed your access, you will be redirected in 10 seconds`, 10000);
			this.canvasSocket.disconnect();
			this._close();
			const timer = setTimeout(() => {
				window.location.pathname = '/app/agility/dashboard';
				clearTimeout(timer);
			}, 10000);
		})

		this.canvasSocket.on('element-added', (container: SerializedContainer) => {
			const ctn = Normalizer.container(this.viewport, container, true);
			if(ctn === undefined) return;
			this.viewport.addChild(ctn);

			if(ctn instanceof LineContainer) {
				this._tryAttachLineToContainer(ctn);
			}
		});

		this.canvasSocket.on('element-deleted', (uuid: string) => {
			try {
				this.viewport.socketPlugin.elements[uuid].destroy();

				const uuidDestroyed: Array<string> = [];
				for (const key in this.viewport.socketPlugin.elements) {
					const { uuid, destroyed } = this.viewport.socketPlugin.elements[key];
					if (destroyed) uuidDestroyed.push(uuid);
				}

				for (let n = 0; n < uuidDestroyed.length; n++) {
					delete this.viewport.socketPlugin.elements[uuidDestroyed[n]];
				}
			} catch (err) {
				if (err instanceof Error) {
					console.error(err.message);
				}
			}
		});

		this.canvasSocket.on(
			'element-bounds-updated',
			(uuid: string, serializedBounds: SerializedContainerBounds) => {
				this._updateTreeBounds(uuid, serializedBounds);
			},
		);

		this.canvasSocket.on(
			'line-controls-updated',
			(uuid: string, serializedControl: SerializedControl) => {
				this._updateLineTree(uuid, serializedControl);
			},
		)

		this.canvasSocket.on(
			'frame-children-added',
			(uuid: string, uuidChild: string, frameNumber: number) => {
				try {
					const frame = this.viewport.socketPlugin.elements[uuid] as FramedContainer;
					const children = this.viewport.socketPlugin.elements[uuidChild] as CanvasContainer;

					frame.addNestedChild(children, frameNumber, true);
				} catch (err) {
					if (err instanceof Error) {
						console.error(err.message);
					}
				}
			},
		);

		this.canvasSocket.on('frame-children-removed', (uuid: string, uuidChild: string) => {
			try {
				const frame = this.viewport.socketPlugin.elements[uuid] as FramedContainer;
				const children = this.viewport.socketPlugin.elements[uuidChild] as CanvasContainer;

				frame.removeNestedChild(children, this.viewport.children.length, true);
			} catch (err) {
				if (err instanceof Error) {
					console.error(err.message);
				}
			}
		});

		this.canvasSocket.on('peer-mouse-moved', (peerId: string, position: ElementPosition) => {
			// console.log(`Peer ${peerId} mouse mooved at position: ${position.x},${position.y}`);
		});

		this.canvasSocket.on('element-colorimetry-updated', (uuid: string, serializedColorimetry: SerializedColorimetry) => {
			this._updateColorimetry(uuid, serializedColorimetry);
		});
	}

	private _updateTreeBounds(uuid: string, serializedBounds: SerializedContainerBounds) {
		try {
			const element = this.viewport.socketPlugin.elements[uuid];
			if (element instanceof FramedContainer) {
				element.updateTreeBounds(serializedBounds);

				for (const container of serializedBounds.childs) {
					this._updateTreeBounds(container.uuid, container as SerializedContainerBounds);
				}
			} else if (element instanceof GenericContainer) {
				element.updateTreeBounds(serializedBounds);
			}

			element.emit('moved', null);
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
			}
		}
	}

	private _updateColorimetry(uuid: string, serializedColorimetry: SerializedColorimetry) {
		try {
			const element = this.viewport.socketPlugin.elements[uuid];
			if(element instanceof FramedContainer) {
				const background = element.children[0] as Rectangle;
				background.color = serializedColorimetry.background.properties.color;
				background.alpha = serializedColorimetry.background.properties.alpha;
				background.draw({
					x: background.x,
					y: background.y,
					width: background.width,
					height: background.height,
				});
			} else if(element instanceof GenericContainer || element instanceof LineContainer) {
				const childData = serializedColorimetry.childs[0] as SerializedGraphicColorimetry;
				const child = element.getGraphicChildren()[0];
				child.color = childData.properties.color;
				child.alpha = childData.properties.alpha;
				child.draw({
					x: child.x,
					y: child.y,
					width: child.width,
					height: child.height,
					//@ts-ignore
					radius: child.radius,
				});
			}
		} catch(err) {
			if (err instanceof Error) {
				console.error(err.message);
			}
		}
	}

	private _updateLineTree(uuid: string, serializedControl: SerializedControl) {
		try {
			const element = this.viewport.socketPlugin.elements[uuid];
			if (element instanceof LineContainer) {
				element.updateLineTree(serializedControl);
				this._tryAttachLineToContainer(element);
			}
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
			}
		}
	}

	private _tryAttachLineToContainer(ctn: LineContainer) {
		if(ctn.startContainer?.containerUUID !== undefined) {
			const container = this.viewport.socketPlugin.elements[ctn.startContainer.containerUUID] as CanvasContainer;
			if(!container.linkedLinesUUID.includes(ctn.uuid)) {
				container.attachLine(ctn.uuid);
			}
		}

		if(ctn.endContainer?.containerUUID !== undefined) {
			const container = this.viewport.socketPlugin.elements[ctn.endContainer.containerUUID] as CanvasContainer;
			if(!container.linkedLinesUUID.includes(ctn.uuid)) {
				container.attachLine(ctn.uuid);
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

	public updateFrameOnChildRemoved(
		uuid: string,
		serialized: SerializedContainer,
		serializedChild: SerializedContainer,
	) {
		this.canvasSocket.emit('remove-frame-children', { uuid, serialized, serializedChild });
	}

	public updateLineControls(uuid: string, serializedControl: SerializedControl) {
		this.canvasSocket.emit('update-line-controls', { uuid, serializedControl });
	}

	public updateColorimetry(uuid: string, serializedColorimetry: SerializedColorimetry) {
		this.canvasSocket.emit('update-element-colorimetry', { uuid, serializedColorimetry });
	}
}
