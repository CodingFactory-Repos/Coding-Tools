import { Manager, ManagerOptions, Socket } from 'socket.io-client';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { Normalizer } from './normalyzer';
import { GenericContainer } from './genericContainer';
import { ModelGraphics } from '../types/pixi-class';
import { FramedContainer } from './framedContainer';
import { temporaryNotification } from '../utils/temporary.notification';

interface ElementPosition {
	x: number;
	y: number;
}

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
			for(let n = 0; n < this.viewport.children.length; n++) {
				const child = this.viewport.children[n];
				if(child.uuid && child.uuid === uuid) {
					child.destroy();
					break;
				}
			}
		});

		this.canvasSocket.on('element-position-updated', (uuid: string, position: ElementPosition) => {
			// TODO: This is too heavy, would be easier if all elements of the canvas were listed by [key: string]: Instance
			viewport: for(let n = 0; n < this.viewport.children.length; n++) {
				const child = this.viewport.children[n];

				if(child instanceof GenericContainer) {
					if(child.uuid && child.uuid === uuid) {
						child.children[0].position.set(position.x, position.y);
						break;
					}

					for(let i = 0; i < child.children?.length; i++) {
						const subChild = child.children[i] as GenericContainer | ModelGraphics;
						
						if(subChild.uuid && subChild.uuid === uuid) {
							child.children[0].position.set(position.x, position.y);
							break viewport;
						}
					}
				}

				// TODO: Broken, i'm not very surprised
				if(child instanceof FramedContainer) {
					// if(child.uuid && child.uuid === uuid) {
					// 	child.mainContainer.position.set(position.x, position.y);
					// 	break;
					// }

					// for(let i = 0; i < child.children?.length; i++) {
					// 	const subChild = child.children[i] as GenericContainer | ModelGraphics;
						
					// 	if(subChild.uuid && subChild.uuid === uuid) {
					// 		child.children[0].position.set(position.x, position.y);
					// 		break viewport;
					// 	}
					// }
				}
			}
		});

		this.canvasSocket.on('peer-mouse-updated', (peerId: string, position: ElementPosition) => {
			console.log(`Peer ${peerId} mouse mooved at position: ${position}`);
		})
	}

	public updateElementPosition(uuid: string, position: ElementPosition) {
		this.canvasSocket.emit('update-element-position', { uuid, position });
	}

	public addElement(container: SerializedContainer) {
		this.canvasSocket.emit('add-element', container);
	}

	public deleteElement(uuid: string) {
		this.canvasSocket.emit('delete-element', uuid);
	}
}
