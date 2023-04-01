import { IViewportOptions } from 'pixi-viewport';
import { Application, EventSystem } from 'pixi.js';
import { ViewportUI } from './viewportUI';


export class Scene extends Application {
	public readonly viewport: ViewportUI;

	constructor(canvas: HTMLCanvasElement) {
		super({
			view: canvas,
			width: window.innerWidth,
			height: window.innerHeight,
			autoDensity: true,
			backgroundColor: 0x2c2e3a,
			resolution: devicePixelRatio + 1,
		});

		const event = new EventSystem(this.renderer);
		event.domElement = this.renderer.view as HTMLCanvasElement;
		event.resolution = devicePixelRatio + 1;

		const viewportOptions: IViewportOptions = {
			worldWidth: 1000,
			worldHeight: 1000,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			events: event,
		}

		this.viewport = new ViewportUI(viewportOptions, this);
		this.stage.addChild(this.viewport);
		this.ticker.start();
	}
}