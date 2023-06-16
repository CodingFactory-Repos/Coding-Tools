import { IViewportOptions, Viewport } from 'pixi-viewport';
import {
	ICanvas,
	IRenderer,
} from 'pixi.js';
import type { Stage } from './types/pixi-aliases';
import { CanvasSocketOptions } from './plugins/viewportSocketPlugin';
import { CursorScene } from './cursorScene';
import { SocketCursorManager } from './class/socketCursorManager';
import { Circle } from './model/model-constructor/circle';
import { ElementPosition } from './types/pixi-container';
import { ViewportZoomPlugin } from './plugins/viewportZoomPlugin';
import { Cursor } from './model/model-constructor/cursor';
import { hexToDecim } from './utils/colorsConvertor';

export class ViewportCursor extends Viewport {
	public readonly scene: CursorScene;
	public readonly renderer: IRenderer<ICanvas>;
	public readonly parent: Stage;
	public readonly socketCursorManager: SocketCursorManager;
	public cursor: CSSStyleProperty.Cursor;
	public cursorElements: { [key:string]: Circle } = {};
	public readonly zoomPlugin: ViewportZoomPlugin;

	constructor(
		scene: CursorScene,
		options: IViewportOptions,
		firstName: string,
		socketOptions?: CanvasSocketOptions,
	) {
		super(options);

		this.drag().pinch({ percent: 2 }).wheel().decelerate();
		this.scene = scene;
		this.renderer = scene.renderer;

		this.zoomPlugin = new ViewportZoomPlugin(this);
		if (socketOptions) {
			this.socketCursorManager = new SocketCursorManager(
				socketOptions.uri,
				socketOptions.roomId,
				socketOptions.options,
				this,
				firstName,
			);
		}

		window.addEventListener('resize', this._onWindowResized.bind(this));
	}

	public updateMousePosition(mouse: ElementPosition) {
		this.socketCursorManager.updateMouseMoved(mouse);
	}

	public offWindowResized() {
		window.removeEventListener('resize', this._onWindowResized);
	}

	private _onWindowResized() {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight - this.scene.heightOffset;

		this.scene.renderer.resize(newWidth, newHeight);
		this.screenWidth = newWidth;
		this.screenHeight = newHeight;
		this.worldWidth = newWidth;
		this.worldHeight = newHeight;
	}

	public addCursorElement(uuid: string, firstName: string, mouse: ElementPosition) {
		const circle = new Cursor({
			//@ts-ignore
			typeId: "cursor",
			uuid: uuid,
			properties: {
				cursor: 'none',
				eventMode: 'none',
				color: this.getRandomSoftColor(),
				alpha: 1,
				text: firstName
			},
			bounds: {
				x: mouse.x,
				y: mouse.y,
				width: 10,
				height: 10,
			}
		})

		this.addChild(circle);
		this.cursorElements[uuid] = circle;
	}

	getRandomSoftColor() {
		const softColors = ["#F5A9A9", "#F5D0A9", "#F5F6CE", "#D0F5A9", "#A9F5A9", "#A9F5F2", "#A9D0F5", "#A9A9F5", "#D0A9F5", "#F5A9F2"];
		const randomIndex = Math.floor(Math.random() * softColors.length);
		return hexToDecim(softColors[randomIndex]);
	}

	public updateCursorElement(element: Circle, mouse: ElementPosition) {
		element.position.set(mouse.x - element.width / 2, mouse.y - element.height / 2);
	}
}
