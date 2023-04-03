import { Point, FederatedPointerEvent } from 'pixi.js';
import { ContainerSize, InitialResizeState, PluginContainer, ProportionScaleOptions } from "../types/pixi-container-options";
import { ViewportUI } from '../viewportUI';
import { ResizeHandle } from '../types/pixi-enums';
import { Handle } from '../model/model-constructor/handle';
import { HitArea } from '../model/model-constructor/hitArea';

export class ResizePlugin {
	protected readonly viewport: ViewportUI;
	protected readonly initialGraphicsState: Array<InitialResizeState> = [];
	protected readonly handler: (e: FederatedPointerEvent) => void;
	protected initialContainerSize: ContainerSize = null;
	protected initialCursorPosition: Point = null;
	protected handleId: ResizeHandle = null;
	protected container: PluginContainer = null;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
		this.handler = this._update.bind(this);
	}

	public attach(container: PluginContainer) {
		this.container = container;
		this._createResizeTransform();
	}

	public detach() {
		this.initialGraphicsState.length = 0;
		this.initialCursorPosition = null;
		this.initialContainerSize = null;
		this.container = null;
		this.handleId = null;
		this._destroyResizeTransform();
	}

	private _destroyResizeTransform() {
		this.viewport.destroyResizeHitArea();
		this.viewport.destroyResizeHandles();
	}

	private _createResizeTransform() {
		const { x, y, width, height } = this.container.getGeometry();
		this.viewport.createResizeHitAreas(x, y, width, height);
		this.viewport.createResizeHandles(x, y, width, height);

		this.viewport.resizeHitAreas.forEach((hit) => {
			hit.on('pointerdown', this._initResizeTransform.bind(this));
		});

		this.viewport.resizeHandles.forEach((handle) => {
			handle.on('pointerdown', this._initResizeTransform.bind(this));
		})
	}

	private _initResizeTransform = (e: FederatedPointerEvent) => {
		e.stopPropagation();
		const target = e.target as Handle | HitArea;
		this.handleId = target.handleId;

		const graphics = this.container.getGraphicChildren();
		for(let n = 0; n < graphics.length; n++) {
			this.initialGraphicsState.push({
				child: graphics[n],
				width: graphics[n].width,
				height: graphics[n].height,
				x: graphics[n].x,
				y: graphics[n].y,
			})
		}

		const { width, height } = this.container;
		this.initialContainerSize = { width, height },
		this.initialCursorPosition = this.viewport.toWorld(e.global.clone());

		this.container.on('pointerup', this._endResizeTransform);
		this.viewport.on('pointerup', this._endResizeTransform);
		this.viewport.on('mouseleave', this._endResizeTransform);
		this.viewport.on('pointermove', this._update);
		if(this.handleId < 4) {
			this.viewport.resizeHandles[this.handleId].on('pointermove', this.handler);
		} else {
			this.viewport.resizeHitAreas[this.handleId - 4].on('pointermove', this.handler);
		}
	}

	private _update = (e: FederatedPointerEvent) => {
		e.stopPropagation();
		const shift = e.originalEvent.shiftKey;
		const cursorPosition = this.viewport.toWorld(e.global.clone());
		const dx = (cursorPosition.x - this.initialCursorPosition.x)
		const dy = (cursorPosition.y - this.initialCursorPosition.y)

		const ratioA = this.initialContainerSize.height / this.initialContainerSize.width;
		const ratioB = this.initialContainerSize.width / this.initialContainerSize.height;
	
		for(let n = 0; n < this.initialGraphicsState.length; n++) {
			const updates = {...this.initialGraphicsState[n]}; // create a new object reference

			const sharedOptions = {
				parentInitialWidth: this.initialContainerSize.width,
				parentInitialHeight: this.initialContainerSize.height,
				childInitialX: updates.x,
				childInitialY: updates.y,
				childInitialWidth: updates.width,
				childInitialHeight: updates.height,
			}

			switch (this.handleId) {
				case ResizeHandle.LT: {
					const heightRatio = shift
						? (this.initialContainerSize.width - dx) * ratioA
						: this.initialContainerSize.height - dy;

					const { x, y, width, height } = this._proportionalScale({
						...sharedOptions,
						parentPrimeWidth: this.initialContainerSize.width - dx,
						parentPrimeHeight: heightRatio,
						anchorX: this.container.absMaxX,
						anchorY: this.container.absMaxY,
					});
					updates.width = width;
					updates.height = height;
					updates.x = x;
					updates.y = updates.y === this.container.absMaxY ? updates.y : y;
					break;
				}
				case ResizeHandle.RT: {
					const heightRatio = shift
						? (this.initialContainerSize.width + dx) * ratioA
						: this.initialContainerSize.height - dy;

					const { x, y, width, height } = this._proportionalScale({
						...sharedOptions,
						parentPrimeWidth: this.initialContainerSize.width + dx,
						parentPrimeHeight: heightRatio,
						anchorX: this.container.absMinX,
						anchorY: this.container.absMaxY,
					});
					updates.width = width;
					updates.height = height;
					updates.x = x;
					updates.y = (updates.y + updates.height) === this.container.absMaxY ? updates.y : y;
					break;
				}
				case ResizeHandle.LB: {
					const heightRatio = shift 
						? (this.initialContainerSize.width - dx) / ratioB
						: this.initialContainerSize.height + dy;

					const { x, y, width, height } = this._proportionalScale({
						...sharedOptions,
						parentPrimeWidth: this.initialContainerSize.width - dx,
						parentPrimeHeight: heightRatio,
						anchorX: this.container.absMaxX,
						anchorY: this.container.absMinY,
					});
					updates.width = width;
					updates.height = height;
					updates.x = updates.x === this.container.absMaxX ? updates.x : x;
					updates.y = updates.y === this.container.absMinY ? updates.y : y;
					break;
				}
				case ResizeHandle.RB: {
					const heightRatio = shift
						? (this.initialContainerSize.width + dx) / ratioB
						: this.initialContainerSize.height + dy;

					const { x, y, width, height } = this._proportionalScale({
						...sharedOptions,
						parentPrimeWidth: this.initialContainerSize.width + dx,
						parentPrimeHeight: heightRatio,
						anchorX: this.container.absMinX,
						anchorY: this.container.absMinY,
					});
					updates.width = width;
					updates.height = height;
					updates.x = x;
					updates.y = updates.y === this.container.absMinY ? updates.y : y;
					break;
				}
				case ResizeHandle.T: {
					const { y, height } = this._proportionalScale({
						...sharedOptions,
						parentPrimeWidth: this.initialContainerSize.width,
						parentPrimeHeight: this.initialContainerSize.height - dy,
						anchorX: this.container.absMaxX,
						anchorY: this.container.absMaxY,
					});
					updates.height = height;
					updates.y = y;
					break;
				}
				case ResizeHandle.R: {
					const { x, width } = this._proportionalScale({
						...sharedOptions,
						parentPrimeWidth: this.initialContainerSize.width + dx,
						parentPrimeHeight: this.initialContainerSize.height,
						anchorX: this.container.absMinX,
						anchorY: this.container.absMinY,
					});
					updates.width = width;
					updates.x = x;
					break;
				}
				case ResizeHandle.B: {
					const { y, height } = this._proportionalScale({
						...sharedOptions,
						parentPrimeWidth: this.initialContainerSize.width,
						parentPrimeHeight: this.initialContainerSize.height + dy,
						anchorX: this.container.absMinX,
						anchorY: this.container.absMinY,
					});
					updates.height = height;
					updates.y = y;
					break;
				}
				case ResizeHandle.L: {
					const { x, width } = this._proportionalScale({
						...sharedOptions,
						parentPrimeWidth: this.initialContainerSize.width - dx,
						parentPrimeHeight: this.initialContainerSize.height,
						anchorX: this.container.absMaxX,
						anchorY: this.container.absMaxY,
					});
					updates.width = width;
					updates.x = x;
					break;
				}
			}

			this.initialGraphicsState[n].child.width = updates.width;
			this.initialGraphicsState[n].child.height = updates.height;
			this.initialGraphicsState[n].child.x = updates.x;
			this.initialGraphicsState[n].child.y = updates.y;
		}

		const geometry = this.container.getGeometry();
		this.viewport.destroyBorder();
		this.viewport.createBorder({ ...geometry, scale: this.viewport.scaled });
		this.viewport.updateResizeHitAreas(geometry);
		this.viewport.updateResizeHandles(geometry, false);
	}

	private _endResizeTransform = (e: FederatedPointerEvent) => {
		e.stopPropagation();
		this.container.off('pointerup', this._endResizeTransform);
		this.viewport.off('pointerup', this._endResizeTransform);
		this.viewport.off('mouseleave', this._endResizeTransform);
		this.viewport.off('pointermove', this._update);

		if(this.handleId < 4) {
			this.viewport.resizeHandles[this.handleId].off('pointermove', this.handler);
		} else {
			this.viewport.resizeHitAreas[this.handleId - 4].off('pointermove', this.handler);
		}

		this.initialGraphicsState.length = 0;
		this.initialContainerSize = null;
		this.initialCursorPosition = null;
		this.handleId = null;
	}

	private _proportionalScale({
		parentInitialWidth,
		parentInitialHeight,
		parentPrimeWidth,
		parentPrimeHeight,
		anchorX,
		anchorY,
		childInitialX,
		childInitialY,
		childInitialWidth,
		childInitialHeight,
	}: ProportionScaleOptions
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
}