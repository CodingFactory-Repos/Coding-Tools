import { Application, EventSystem } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { ElementOptions, PixiObject } from './types';
import { StaticGrid } from './models/static/grid';
import { reactive } from 'vue';

const MAX_ZOOM = 50 as const;
const MIN_ZOOM = 0.01 as const;
const MAX_STEP = 14 as const;

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
	 * A reactive property zoom that store the scale of viewport
	 * @private
	 */
	private _zoom = reactive({ value: 0 });

	/**
	 * Define at the current step between min scale and max scale constraints by the exponential spacing;
	 * @private
	 */
	private _step: number;

	/**
	 * The step multiplicator, the exponential spacing between min scale and max scale constraints by max step.
	 * @private
	 */
	private _multiplicator: number;

	/**
	 * Constructs a new Scene.
	 * @param canvas - The canvas element to use for rendering.
	 * @param darkMode - If the website use darkmode, the canvas is in darkmode.
	 */
	constructor(canvas: HTMLCanvasElement, darkMode = false) {
		super({
			view: canvas,
			width: window.innerWidth,
			height: window.innerHeight,
			antialias: true,
			autoDensity: true,
			backgroundColor: darkMode ? 0x2c2e3a : 0xe5e5e5,
			resolution: 1, //! Break the zoom on for whatever reason.
			//! 2 : (high quality) -> The wheel area is broken,
			//! 1 : (bad quality) -> Fine,
			//! 0 : (shit quality): -> Nope,
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

		this.viewport.drag().pinch({ percent: 2 }).wheel().decelerate();

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
		});

		window.addEventListener('resize', () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;

			this.renderer.resize(newWidth, newHeight);
			this._viewport.screenWidth = newWidth;
			this._viewport.screenHeight = newHeight;
			this._viewport.worldWidth = newWidth;
			this._viewport.worldHeight = newHeight;
		});

		this._viewport.on('zoomed', this._onViewportZoom);
		this._multiplicator = Math.pow((MAX_ZOOM / MIN_ZOOM), (1 / MAX_STEP));
		this._deduceZoomStep();
		this._updateZoomPercentage();
	}

	/**
	 * Calculate the zoom percentage of the viewport size compared to the world view.
	 * @private
	 */
	private _updateZoomPercentage() {
		const { worldScreenWidth, worldScreenHeight, screenWidth, screenHeight } = this._viewport;
		const zoomPercentage = Math.round(Math.min(screenWidth / worldScreenWidth, screenHeight / worldScreenHeight) * 100);
		this._zoom.value = zoomPercentage;
	}

	/**
	 * Increase and decrease the current zoom step, and update the scaling.
	 * @param zoomIn 0 | 1
	 * @returns void
	 */
	public updateZoomStep(zoomIn: number) {
		if(zoomIn && this._step < MAX_STEP) {
			this._step++;
		} else if(!zoomIn && this._step > 0) {
			this._step--;
		} else {
			return;
		}

		let scale = MIN_ZOOM;
		for(let n = 0; n < this._step; n++) {
			scale *= this._multiplicator;
		}

		this._viewport.setZoom(scale, true);
		this._onViewportZoom();
	}
	
	/**
	 * Determine the current zoom step based on the viewport scale, how many spacing is possible with the current scale of the viewport.
	 * @private
	 */
	private _deduceZoomStep() {
		const threshold = 0.45;
		this._step = Math.round((Math.log(this._viewport.scale.x / MIN_ZOOM) / Math.log(this._multiplicator)) - threshold);
	}

	/**
	 * Handles the 'zoomed' event on the viewport. This updates the grid and containers based on the new zoom level.
	 * @private
	 */
	private _onViewportZoom = () => {
		if (this._viewport.scale.x > 50) {
			this._viewport.scale.x = 50;
			this._viewport.scale.y = 50;
		}

		if (this._viewport.scale.x < 0.01) {
			this._viewport.scale.x = 0.01;
			this._viewport.scale.y = 0.01;
		}

		this._deduceZoomStep();
		this._updateZoomPercentage();

		if (this._viewport.scale.x > 5) {
			this._grid.dispatch.emit('updated', this.getOptions());
		} else this._grid.dispatch.emit('cleared');

		for (const container of this._viewport.children as Array<PixiObject>) {
			if (container.isSelected || container.isHovered) {
				container.updateOnScale();
			}
		}
	};

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
		};
	}

	/**
	 * The viewport for the scene.
	 * @returns The viewport for the scene.
	 */
	get viewport() {
		return this._viewport;
	}

	get zoom() {
		return this._zoom;
	}
}
