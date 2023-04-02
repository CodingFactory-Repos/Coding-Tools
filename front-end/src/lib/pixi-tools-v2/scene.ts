import { IViewportOptions } from 'pixi-viewport';
import { Application, EventSystem } from 'pixi.js';
import { ViewportUI } from './viewportUI';


export class Scene extends Application {
	public readonly viewport: ViewportUI;
	public heightOffset: number;

	constructor(canvas: HTMLCanvasElement, heightOffset: number) {
		super({
			view: canvas,
			width: window.innerWidth,
			height: window.innerHeight - heightOffset,
			autoDensity: true,
			backgroundColor: 0x202126,
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
		}

		this.heightOffset = heightOffset;
		this.viewport = new ViewportUI(viewportOptions, this);
		this.stage.addChild(this.viewport);
		this.ticker.start();
	}
}