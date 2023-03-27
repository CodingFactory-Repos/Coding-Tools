import { Viewport } from 'pixi-viewport';
import { Application, EventSystem } from 'pixi.js';
import { ContainerManager } from './class/containerManager';


export class Scene extends Application {
	private _viewport: Viewport;
	private _manager: ContainerManager;

	constructor(canvas: HTMLCanvasElement) {
		super({
			view: canvas,
			width: window.innerWidth,
			height: window.innerHeight,
			autoDensity: true,
			backgroundColor: 0x2c2e3a,
			resolution: devicePixelRatio,
		});

		const event = new EventSystem(this.renderer);
		event.domElement = this.renderer.view as HTMLCanvasElement;
		event.resolution = devicePixelRatio;

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

		this._manager = new ContainerManager(this);

		window.addEventListener('resize', () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;

			this.renderer.resize(newWidth, newHeight);
			this._viewport.screenWidth = newWidth;
			this._viewport.screenHeight = newHeight;
			this._viewport.worldWidth = newWidth;
			this._viewport.worldHeight = newHeight;
		});

		this.stage.on("pointerdown", () => {
			this._manager.deselectAll();
		})
	}

	get viewport() {
		return this._viewport;
	}

	get manager() {
		return this._manager;
	}
}