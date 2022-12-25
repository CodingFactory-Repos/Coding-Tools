import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { ElementOptions, PixiObject } from './types';

/**
 * Scene is a subclass of PIXI.Application that manages a grid and a viewport.
 * It also keeps track of containers, which are objects that can be interacted with on the scene.
 */
export class Scene extends Application {
	/**
	 * The viewport for the scene.
	 * @private
	 */
	private readonly _viewport: Viewport;

	/**
	 * An array of containers in the scene.
	 */
	public readonly containers: Array<PixiObject> = [];

	/**
	 * Constructs a new Scene.
	 * @param canvas - The canvas element to use for rendering.
	 */
	constructor(canvas: HTMLCanvasElement) {
		super({
			view: canvas,
			width: window.innerWidth - 40,
			height: window.innerHeight,
			antialias: true,
			autoDensity: true,
			backgroundColor: 0xe5e5e5,
			resolution: devicePixelRatio
		});

		this._viewport = new Viewport({
			worldWidth: 1000,
			worldHeight: 1000,
			screenWidth: window.innerWidth - 40,
			screenHeight: window.innerHeight,
			divWheel: this.view as HTMLCanvasElement,
		})
		
		this.viewport
			.drag()
			.pinch({ percent: 2 })
			.wheel()
			.decelerate();

		canvas.addEventListener('mouseout', () => {
			for (const container of this.containers) {
				const isAction = container.isDragging || container.isResizing;
				if (isAction) {
					container.isDragging = false;
					container.isResizing = false;
				}
			}
		})

		this.stage.addChild(this._viewport);
		this.ticker.start();

		window.addEventListener('resize', () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;

			this.renderer.resize(newWidth, newHeight);
			this._viewport.screenWidth = newWidth;
			this._viewport.screenHeight = newHeight;
			this._viewport.worldWidth = newWidth;
			this._viewport.worldHeight = newHeight;
		});
	}

	/**
	 * Returns the current options for the scene, including the width and height of the view and the current zoom level.
	 * @returns The current options for the scene.
	 */
	public getOptions(): Partial<ElementOptions.ScaledDimensions> {
		return {
			width: this.view.width,
			height: this.view.height,
			scale: this._viewport.scale.x,
		}
	}

	/**
	 * The viewport for the scene.
	 * @returns The viewport for the scene.
	 */
	get viewport() {
		return this._viewport;
	}
}