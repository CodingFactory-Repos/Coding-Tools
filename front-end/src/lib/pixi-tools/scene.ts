import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";

import { ElementOptions, PixiObject } from './types';
import { StaticGrid } from "./models/static/grid";

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
	 * The static grid for the scene.
	 * @private
	 */
	private readonly _grid: StaticGrid;

	/**
	 * Constructs a new Scene.
	 * @param canvas - The canvas element to use for rendering.
	 * @param darkMode - If the website use darkmode, the canvas is in darkmode
	 */
	constructor(canvas: HTMLCanvasElement, darkMode: boolean = false) {
		super({
			view: canvas,
			width: window.innerWidth,
			height: window.innerHeight,
			antialias: true,
			autoDensity: true,
			backgroundColor: darkMode ? 0x212121 : 0xe5e5e5,
			resolution: devicePixelRatio
		});

		this._viewport = new Viewport({
			worldWidth: 1000,
			worldHeight: 1000,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			divWheel: this.view as HTMLCanvasElement,
		})
		
		this.viewport
			.drag()
			.pinch({ percent: 2 })
			.wheel()
			.decelerate();

		this._grid = new StaticGrid(darkMode);
		this.stage.addChild(this._grid);
		this.stage.addChild(this._viewport);
		this.ticker.start();

		canvas.addEventListener('mouseout', () => {
			for (const container of this._viewport.children as Array<PixiObject>) {
				const isAction = container.isDragging || container.isResizing;
				if (isAction) {
					container.isDragging = false;
					container.isResizing = false;
				}
			}
		})

		window.addEventListener('resize', () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;

			this.renderer.resize(newWidth, newHeight);
			this._viewport.screenWidth = newWidth;
			this._viewport.screenHeight = newHeight;
			this._viewport.worldWidth = newWidth;
			this._viewport.worldHeight = newHeight;
		});

		this._viewport.on('zoomed', this._onViewportZoom)
		// this._viewport.on('mousedown', () => {
		// 	const vpos = this._viewport.getBounds();
		// 	const vpos2 = this._viewport.getGlobalPosition();
		// 	const vpos3 = this._viewport.getLocalBounds();
			
		// 	console.log("VIEWPORT BOUNDS::", vpos.x, vpos.y);
		// 	console.log("VIEWPORT GLOBAL::", vpos2.x, vpos2.y);
		// 	console.log("VIEWPORT LOCAL::", vpos3.x, vpos3.y);
		// 	console.log("VIEWPORT", this._viewport.x, this._viewport.y);
			
		// 	if(this._viewport.children.length > 0) {
		// 		const child = this._viewport.children[0];
		// 		const pos = child.getBounds();
		// 		const pos2 = child.getGlobalPosition();
		// 		const pos3 = child.getLocalBounds();
		// 		console.log(child);

		// 		console.log("CHILD BOUNDS::", pos.x, pos.y);
		// 		console.log("CHILD GLOBAL::", pos2.x, pos2.y);
		// 		console.log("CHILD LOCAL::", pos3.x, pos3.y);
		// 		console.log(child.x, child.y);
		// 	}
		// })
	}

	/**
	 * Handles the 'zoomed' event on the viewport. This updates the grid and containers based on the new zoom level.
	 * @private
	 */
	private _onViewportZoom = () => {
		if(this._viewport.scale.x > 255) {
			this._viewport.scale.x = 255;
			this._viewport.scale.y = 255;
		}

		if(this._viewport.scale.x < 0.25) {
			this._viewport.scale.x = 0.25;
			this._viewport.scale.y = 0.25;
		}

		if(this._viewport.scale.x > 5) {
			this._grid.dispatch.emit('updated', this.getOptions());
		} else this._grid.dispatch.emit('cleared');

		for (const container of this._viewport.children as Array<PixiObject>) {
			if (container.isSelected || container.isHovered) {
				container.updateOnScale();
			}
		}
	}

	/**
	 * Returns the current options for the scene, including the width and height of the view and the current scale level.
	 * @returns The current options for the scene.
	 * @public
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