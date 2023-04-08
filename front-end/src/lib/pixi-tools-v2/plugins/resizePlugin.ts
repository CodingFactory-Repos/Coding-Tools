
import { Point, FederatedPointerEvent } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { WrappedContainer } from '../class/wrappedContainer';
import { Handle, HitArea } from '../model/template';
import { ViewportUI } from '../viewportUI';

import { ResizeHandle } from '../types/pixi-enums';
import type { ContainerSize, InitialResizeState, ProportionScaleOptions } from "../types/pixi-container";
import type { PluginContainer } from '../types/pixi-aliases';

export class ResizePlugin {
	protected readonly viewport: ViewportUI;
	protected readonly initialGraphicsState: Array<InitialResizeState> = [];
	protected readonly handler: (e: FederatedPointerEvent) => void;
	protected initialContainerSize: ContainerSize = null;
	protected initialCursorPosition: Point = null;
	protected handleId: ResizeHandle = null;
	protected container: PluginContainer = null;
	protected isResizing: boolean = false;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
		this.handler = this._updateResizeTransform.bind(this);
	}

	public attach(container: PluginContainer) {
		this.container = container;

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

	public detach() {
		if(this.isResizing) return;
		this.initialGraphicsState.length = 0;
		this.initialCursorPosition = null;
		this.initialContainerSize = null;
		this.container = null;
		this.handleId = null;

		this.viewport.destroyResizeHitArea();
		this.viewport.destroyResizeHandles();
	}

	private _initResizeTransform = (e: FederatedPointerEvent) => {
		if(e) e.stopPropagation();
		if(this.container === null) return;

		const target = e.target as Handle | HitArea;
		this.handleId = target.handleId;

		// TODO: Types
		const graphics: any[] = this.container.getGraphicChildren();
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
		this.initialContainerSize = { width, height };
		this.initialCursorPosition = this.viewport.toWorld(e.global.clone());

		this.container.on('pointerup', this._endResizeTransform);
		this.viewport.on('pointerup', this._endResizeTransform);
		this.viewport.on('mouseleave', this._endResizeTransform);
		this.viewport.on('pointermove', this._updateResizeTransform);
		if(this.handleId < 4) {
			this.viewport.resizeHandles[this.handleId].on('pointermove', this.handler);
		} else {
			this.viewport.resizeHitAreas[this.handleId - 4].on('pointermove', this.handler);
		}
	}

	private _updateResizeTransform = (e: FederatedPointerEvent) => {
		if(e) e.stopPropagation();
		if(this.container === null) return;

		try { // Prevent an error when mouse move event and deletion event at the same time
			this.isResizing = true;
			const shift = e.originalEvent.shiftKey;
			const cursorPosition = this.viewport.toWorld(e.global.clone());
			const dx = (cursorPosition.x - this.initialCursorPosition.x);
			const dy = (cursorPosition.y - this.initialCursorPosition.y);

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

			if(this.container instanceof FramedContainer) {
				this.container.emit("moved", null)
			}

			if(this.container instanceof WrappedContainer) {
				for(let n = 0; n < this.container.absoluteChildren.length; n++) {
					if(this.container.absoluteChildren[n].id === "frame") {
						this.container.absoluteChildren[n].emit("moved", null);
					}
				}
			}

			const geometry = this.container.getGeometry();
			this.viewport.destroyBorder();
			this.viewport.createBorder({ ...geometry, scale: this.viewport.scaled });
			this.viewport.updateResizeHitAreas(geometry);
			this.viewport.updateResizeHandles(geometry, false);
		} catch(err) {
			if(err instanceof Error) {
				console.error("Unexpected error during resize :", err.message);
			}

			this._removeViewportResizeEvent();
		}
	}

	private _endResizeTransform = (e: FederatedPointerEvent) => {
		if(e) e.stopPropagation();
		if(this.container === null) return;

		try { // Prevent an error when mouse up event and deletion event at the same time
			this.container.off('pointerup', this._endResizeTransform);
			this._removeViewportResizeEvent();

			this.initialGraphicsState.length = 0;
			this.initialContainerSize = null;
			this.initialCursorPosition = null;
			this.isResizing = false;

			if(this.handleId < 4) {
				this.viewport.resizeHandles[this.handleId].off('pointermove', this.handler);
			} else {
				this.viewport.resizeHitAreas[this.handleId - 4].off('pointermove', this.handler);
			}

			this.handleId = null;
		} catch(err) {
			if(err instanceof Error) {
				console.error("Unexpected error during end resize :", err.message);
			}
		}
	}

	private _removeViewportResizeEvent = () => {
		this.viewport.off('pointerup', this._endResizeTransform);
		this.viewport.off('mouseleave', this._endResizeTransform);
		this.viewport.off('pointermove', this._updateResizeTransform);
		this.isResizing = false;
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