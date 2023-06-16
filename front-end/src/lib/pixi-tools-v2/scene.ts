import { IViewportOptions } from 'pixi-viewport';
import { Application, EventSystem } from 'pixi.js';

import { ViewportUI } from './viewportUI';
import { CanvasSocketOptions } from './plugins/viewportSocketPlugin';

export class Scene extends Application {
	public readonly viewport: ViewportUI;
	public heightOffset: number;

	constructor(
		canvas: HTMLCanvasElement,
		heightOffset: number,
		isDark: boolean,
		socketOptions?: CanvasSocketOptions
	) {
		super({
			view: canvas,
			width: window.innerWidth,
			height: window.innerHeight - heightOffset,
			autoDensity: true,
			backgroundColor: isDark ? 0x202126 : 0xe5e5e5,
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
		this.viewport = new ViewportUI(this, viewportOptions, isDark, socketOptions);
		this.stage.addChild(this.viewport);
		this.ticker.start();
	}

	public changeTheme(isDark: boolean) {
		//@ts-ignore
		this.renderer.background._backgroundColor = isDark ? 0x202126 : 0xe5e5e5;
		this.viewport.changeGridTheme(isDark);
	}
}
