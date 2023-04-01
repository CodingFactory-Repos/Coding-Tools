import { Point, FederatedPointerEvent, DisplayObject } from 'pixi.js';
import { PluginContainer } from "../types/pixi-container-options";
import { ViewportUI } from '../viewportUI';
import { ResizeHandle } from '../types/pixi-enums';

interface InitialResizeState {
	width: number;
	height: number;
	x: number;
	y: number;
}

export class ResizePlugin {
	private _container: PluginContainer;
	private _viewport: ViewportUI; 
	private _startPos: Point;
	private _handleId: ResizeHandle;
	private _initialState: Array<InitialResizeState & { child: DisplayObject }> = [];
	private _handler: (e: FederatedPointerEvent) => void;

	constructor(viewport: ViewportUI) {
		this._viewport = viewport;
		this._handler = this._update.bind(this);
	}

	public attach(container: PluginContainer) {
		this._container = container;
		this._createResizeTransform();
	}

	public detach() {
		this._container = null;
		this._destroyResizeTransform();
	}

	private _createResizeTransform() {
		const { x, y, width, height } = this._container.getGeometry();
		this._viewport.createResizeHitAreas(x, y, width, height);
		this._viewport.createResizeHandles(x, y, width, height);

		this._viewport.resizeHitAreas.forEach((hit) => {
			hit.on('pointerdown', this._resize.bind(this));
		});

		this._viewport.resizeHandles.forEach((handle) => {
			handle.on('pointerdown', this._resize.bind(this));
		})
	}

	private _destroyResizeTransform() {
		this._viewport.destroyResizeHitArea();
		this._viewport.destroyResizeHandles();
	}

	private _resize = (e: FederatedPointerEvent) => {
		e.stopPropagation();
		this._handleId = e.target.handleId;

		const graphics = this._container.getGraphicChildren();
		for(let n = 0; n < graphics.length; n++) {
			this._initialState.push({
				child: graphics[n],
				width: graphics[n].width,
				height: graphics[n].height,
				x: graphics[n].x,
				y: graphics[n].y,
			})
		}

		const { width, height } = this._container;
		this.test = { width, height },

		this._startPos = this._viewport.toWorld(e.global.clone());

		this._container.on('pointerup', this._end);
		this._viewport.on('pointerup', this._end);
		this._viewport.on('mouseleave', this._end);
		this._viewport.on('pointermove', this._update);
		if(this._handleId < 4) {
			this._viewport.resizeHandles[this._handleId].on('pointermove', this._handler);
		} else {
			this._viewport.resizeHitAreas[this._handleId - 4].on('pointermove', this._handler);
		}
	}

	private test: { width: number, height: number };

	public proportionalScale(
		parentInitialWidth: number,
		parentInitialHeight: number,
		parentPrimeWidth: number,
		parentPrimeHeight: number,
		anchorX: number,
		anchorY: number,
		childInitialX: number,
		childInitialY: number,
		childInitialWidth: number,
		childInitialHeight: number,
	) {
		// Calculate ratio of new box size to original box size
		const r_width = parentPrimeWidth / parentInitialWidth;
		const r_height = parentPrimeHeight / parentInitialHeight;
		
		// Calculate the prime x,y of the child relatively to the parent
		const x_prime = (childInitialX - anchorX) * r_width + anchorX;
		const y_prime = (childInitialY - anchorY) * r_height + anchorY;

		// Calculate the prime width,height of the child relatively to the parent
		const w_prime = childInitialWidth * r_width;
		const h_prime = childInitialHeight * r_height;
		
		return { x: x_prime, y: y_prime, width: w_prime, height: h_prime };
	}

	private _update = (e: FederatedPointerEvent) => {
		e.stopPropagation();
		const shift = e.originalEvent.shiftKey;
		const transformedCursorPosition = this._viewport.toWorld(e.global.clone());
		const dx = (transformedCursorPosition.x - this._startPos.x)
		const dy = (transformedCursorPosition.y - this._startPos.y)

		const ratioA = this.test.height / this.test.width;
		const ratioB = this.test.width / this.test.height;
	
		for(let n = 0; n < this._initialState.length; n++) {
			const updates = {...this._initialState[n]};

			switch (this._handleId) {
				case ResizeHandle.LT: {
					const heightRatio = shift ? (this.test.width - dx) * ratioA : this.test.height - dy;
					const { x, y, width, height } = this.proportionalScale(
						this.test.width,
						this.test.height,
						this.test.width - dx,
						heightRatio,
						this._container.absMaxX,
						this._container.absMaxY,
						updates.x,
						updates.y,
						updates.width,
						updates.height,
					);
					updates.width = width;
					updates.height = height;
					updates.x = x;
					updates.y = updates.y === this._container.absMaxY ? updates.y : y;
					break;
				}
				case ResizeHandle.RT: {
					const heightRatio = shift ? (this.test.width + dx) * ratioA : this.test.height - dy;
					const { x, y, width, height } = this.proportionalScale(
						this.test.width,
						this.test.height,
						this.test.width + dx,
						heightRatio,
						this._container.absMinX,
						this._container.absMaxY,
						updates.x,
						updates.y,
						updates.width,
						updates.height,
					);
					updates.width = width;
					updates.height = height;
					updates.x = x;
					updates.y = (updates.y + updates.height) === this._container.absMaxY ? updates.y : y;
					break;
				}
				case ResizeHandle.LB: {
					const heightRatio = shift ? (this.test.width - dx) / ratioB : this.test.height + dy;
					const { x, y, width, height } = this.proportionalScale(
						this.test.width,
						this.test.height,
						this.test.width - dx,
						heightRatio,
						this._container.absMaxX,
						this._container.absMinY,
						updates.x,
						updates.y,
						updates.width,
						updates.height,
					);
					updates.width = width;
					updates.height = height;
					updates.x = updates.x === this._container.absMaxX ? updates.x : x;
					updates.y = updates.y === this._container.absMinY ? updates.y : y;
					break;
				}
				case ResizeHandle.RB: {
					const heightRatio = shift ? (this.test.width + dx) / ratioB : this.test.height + dy;
					const { x, y, width, height } = this.proportionalScale(
						this.test.width,
						this.test.height,
						this.test.width + dx,
						heightRatio,
						this._container.absMinX,
						this._container.absMinY,
						updates.x,
						updates.y,
						updates.width,
						updates.height,
					);
					updates.width = width;
					updates.height = height;
					updates.x = x;
					updates.y = updates.y === this._container.absMinY ? updates.y : y;
					break;
				}
				case ResizeHandle.T: {
					const { y, height } = this.proportionalScale(
						this.test.width,
						this.test.height,
						this.test.width,
						this.test.height - dy,
						this._container.absMaxX,
						this._container.absMaxY,
						updates.x,
						updates.y,
						updates.width,
						updates.height,
					);
					updates.height = height;
					updates.y = y;
					break;
				}
				case ResizeHandle.R: {
					const { x, width } = this.proportionalScale(
						this.test.width,
						this.test.height,
						this.test.width + dx,
						this.test.height,
						this._container.absMinX,
						this._container.absMinY,
						updates.x,
						updates.y,
						updates.width,
						updates.height,
					);
					updates.width = width;
					updates.x = x;
					break;
				}
				case ResizeHandle.B: {
					const { y, height } = this.proportionalScale(
						this.test.width,
						this.test.height,
						this.test.width,
						this.test.height + dy,
						this._container.absMinX,
						this._container.absMinY,
						updates.x,
						updates.y,
						updates.width,
						updates.height,
					);
					updates.height = height;
					updates.y = y;
					break;
				}
				case ResizeHandle.L: {
					const { x, width } = this.proportionalScale(
						this.test.width,
						this.test.height,
						this.test.width - dx,
						this.test.height,
						this._container.absMaxX,
						this._container.absMaxY,
						updates.x,
						updates.y,
						updates.width,
						updates.height,
					);
					updates.width = width;
					updates.x = x;
					break;
				}
			}

			this._initialState[n].child.width = updates.width;
			this._initialState[n].child.height = updates.height;
			this._initialState[n].child.x = updates.x;
			this._initialState[n].child.y = updates.y;
		}

		const geometry = this._container.getGeometry();
		this._viewport.destroyBorder();
		this._viewport.createBorder({ ...geometry, scale: this._viewport.scaled });
		this._viewport.updateResizeHitAreas(geometry);
		this._viewport.updateResizeHandles(geometry);
	}

	private _end = (e: FederatedPointerEvent) => {
		e.stopPropagation();
		this._container.off('pointerup', this._end);
		this._viewport.off('pointerup', this._end);
		this._viewport.off('mouseleave', this._end);
		this._viewport.off('pointermove', this._update);
		if(this._handleId < 4) {
			this._viewport.resizeHandles[this._handleId].off('pointermove', this._handler);
		} else {
			this._viewport.resizeHitAreas[this._handleId - 4].off('pointermove', this._handler);
		}
		this._initialState = [];
	}
}