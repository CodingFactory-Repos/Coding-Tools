import { IViewportOptions } from 'pixi-viewport';
import { Application, EventSystem } from 'pixi.js';

import { CanvasSocketOptions } from './plugins/viewportSocketPlugin';
import { ViewportCursor } from './viewportCursor';

export class CursorScene extends Application {
	public readonly viewport: ViewportCursor;
	public heightOffset: number;

	constructor(
		canvas: HTMLCanvasElement,
		heightOffset: number,
		firstName: string,
		socketOptions?: CanvasSocketOptions,
	) {
		super({
			view: canvas,
			width: window.innerWidth,
			height: window.innerHeight - heightOffset,
			autoDensity: true,
			backgroundAlpha: 0,
			resolution: devicePixelRatio + 1,
		});

		const event = new EventSystem(this.renderer);
		event.domElement = this.renderer.view as HTMLCanvasElement;
		event.resolution = devicePixelRatio + 1;

		const viewportOptions: IViewportOptions = {
			worldWidth: 1000,
			worldHeight: 1000,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight - heightOffset,
			events: event,
		};

		this.heightOffset = heightOffset;
		this.viewport = new ViewportCursor(this, viewportOptions, firstName, socketOptions);
		this.stage.addChild(this.viewport);
		this.ticker.start();
	}
}
