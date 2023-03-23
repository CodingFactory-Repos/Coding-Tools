import { Viewport } from 'pixi-viewport';
import { Application, EventSystem } from 'pixi.js';


export class Scene extends Application {
	private _viewport: Viewport;

	constructor(canvas: HTMLCanvasElement) {
		super({
			view: canvas,
			width: window.innerWidth,
			height: window.innerHeight,
			antialias: true,
			autoDensity: true,
			backgroundColor: 0x2c2e3a,
			resolution: 1,
		});

		const event = new EventSystem(this.renderer);
		event.domElement = this.renderer.view as HTMLCanvasElement;

		this._viewport = new Viewport({
			worldWidth: 1000,
			worldHeight: 1000,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			events: event,
		});

		this._viewport.drag().pinch({ percent: 2 }).wheel().decelerate();
		this.stage.addChild(this._viewport);
		this.ticker.start();
	}

	get viewport() {
		return this._viewport;
	}
}