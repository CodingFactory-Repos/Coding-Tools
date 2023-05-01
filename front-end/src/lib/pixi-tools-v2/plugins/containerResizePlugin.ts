import { Point, FederatedPointerEvent } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { WrappedContainer } from '../class/wrappedContainer';
import { Handle, HitArea } from '../model/template-ui';
import { ViewportUI } from '../viewportUI';

import {
	ResizeHandle,
	ResizeHandleOppositeOf,
	RightWall,
	LeftWall,
	TopWall,
	BottomWall,
} from '../types/pixi-enums';
import type { PluginContainer } from '../types/pixi-aliases';
import type { ContainerSize, InitialGraphicState } from '../types/pixi-container';

export interface ProportionScaleOptions {
	parentInitialWidth: number;
	parentInitialHeight: number;
	parentPrimeWidth: number;
	parentPrimeHeight: number;
	anchorX: number;
	anchorY: number;
	childInitialX: number;
	childInitialY: number;
	childInitialWidth: number;
	childInitialHeight: number;
}

export class ResizePlugin {
	protected readonly viewport: ViewportUI;
	protected readonly initialGraphicsState: Array<InitialGraphicState> = [];
	protected readonly handler: (e: FederatedPointerEvent) => void;
	protected initialContainerSize: ContainerSize = null;
	protected initialCursorPosition: Point = null;
	protected handleId: ResizeHandle = null;
	protected container: PluginContainer = null;
	protected isResizing = false;

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
		});
	}

	public detach() {
		if (this.isResizing) return;
		this.initialGraphicsState.length = 0;
		this.initialCursorPosition = null;
		this.initialContainerSize = null;
		this.container = null;
		this.handleId = null;

		this.viewport.destroyResizeHitArea();
		this.viewport.destroyResizeHandles();
	}

	private _initResizeTransform = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		const target = e.target as Handle | HitArea;
		this.handleId = target.handleId;

		const graphics = this.container.getGraphicChildren();
		for (const element of graphics) {
			this.initialGraphicsState.push({
				child: element,
				width: element.width,
				height: element.height,
				x: element.x,
				y: element.y,
			});
		}

		const { width, height, absMinX, absMaxY, absMaxX, absMinY } = this.container;
		this.initialContainerSize = { width, height, absMinX, absMaxY, absMaxX, absMinY };

		if (this.handleId < 4) {
			this.viewport.resizeHandles[this.handleId].on('pointermove', this.handler);
			const { x, y } = this.viewport.resizeHandles[this.handleId];
			this.initialCursorPosition = new Point(x, y);
		} else {
			this.viewport.resizeHitAreas[this.handleId - 4].on('pointermove', this.handler);
			const { x, y } = this.viewport.resizeHitAreas[this.handleId - 4];
			this.initialCursorPosition = new Point(x, y);
		}

		this.container.on('pointerup', this._endResizeTransform);
		this.viewport.on('pointerup', this._endResizeTransform);
		this.viewport.on('mouseleave', this._endResizeTransform);
		this.viewport.on('pointermove', this._updateResizeTransform);
	};

	private _updateResizeTransform = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		try {
			// Prevent an error when mouse move event and deletion event at the same time
			this.isResizing = true;
			const shift = e.originalEvent.shiftKey;
			const cursorPosition = this.viewport.toWorld(e.global.clone());
			const dx = cursorPosition.x - this.initialCursorPosition.x;
			const dy = cursorPosition.y - this.initialCursorPosition.y;

			const isPastLeft =
				LeftWall.includes(this.handleId) && cursorPosition.x < this.initialContainerSize.absMinX;
			const isPastRight =
				RightWall.includes(this.handleId) && cursorPosition.x > this.initialContainerSize.absMaxX;
			const isPastTop =
				TopWall.includes(this.handleId) && cursorPosition.y < this.initialContainerSize.absMinY;
			const isPastBottom =
				BottomWall.includes(this.handleId) && cursorPosition.y > this.initialContainerSize.absMaxY;
			const isPastBounds = isPastLeft || isPastRight || isPastBottom || isPastTop;

			const ratioA = this.initialContainerSize.height / this.initialContainerSize.width;
			const ratioB = this.initialContainerSize.width / this.initialContainerSize.height;

			for (let n = 0; n < this.initialGraphicsState.length; n++) {
				const updates = { ...this.initialGraphicsState[n] }; // create a new object reference

				if (isPastLeft) {
					const mirror = this._proportionalMirrorPosition({
						anchor: this.initialContainerSize.absMinX,
						childCurrentPos: updates.child.x,
						childCurrentSize: updates.child.width,
					});
					this.initialGraphicsState[n].child.x = mirror;
				} else if (isPastRight) {
					const mirror = this._proportionalMirrorPosition({
						anchor: this.initialContainerSize.absMaxX,
						childCurrentPos: updates.child.x,
						childCurrentSize: updates.child.width,
					});
					this.initialGraphicsState[n].child.x = mirror;
				} else if (isPastTop) {
					const mirror = this._proportionalMirrorPosition({
						anchor: this.initialContainerSize.absMinY,
						childCurrentPos: updates.child.y,
						childCurrentSize: updates.child.height,
					});
					this.initialGraphicsState[n].child.y = mirror;
				} else if (isPastBottom) {
					const mirror = this._proportionalMirrorPosition({
						anchor: this.initialContainerSize.absMaxY,
						childCurrentPos: updates.child.y,
						childCurrentSize: updates.child.height,
					});
					this.initialGraphicsState[n].child.y = mirror;
				}

				if (isPastBounds) continue;

				const sharedOptions = {
					parentInitialWidth: this.initialContainerSize.width,
					parentInitialHeight: this.initialContainerSize.height,
					childInitialX: updates.x,
					childInitialY: updates.y,
					childInitialWidth: updates.width,
					childInitialHeight: updates.height,
				};

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
						updates.y = updates.y + updates.height === this.container.absMaxY ? updates.y : y;
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
				this.initialGraphicsState[n].child.x = updates.x;
				this.initialGraphicsState[n].child.height = updates.height;
				this.initialGraphicsState[n].child.y = updates.y;
			}

			if (this.container instanceof FramedContainer) {
				this.container.emit('moved', null);
			}

			if (this.container instanceof WrappedContainer) {
				for (const element of this.container.absoluteChildren) {
					if (element instanceof FramedContainer) {
						element.emit('moved', null);
					}
				}
			}

			if (this.viewport.socketPlugin) {
				const containers = this.container instanceof WrappedContainer ? this.container.absoluteChildren : [this.container];

				for(const container of containers) {
					container.getGeometry();
					this.viewport.socketPlugin.emit('ws-element-updated', container.uuid, container.serializeBounds());
				}
			}

			const geometry = this.container.getGeometry();
			this.viewport.destroyBorder();
			this.viewport.createBorder({ ...geometry, scale: this.viewport.scaled });
			this.viewport.updateResizeHitAreas(geometry);
			this.viewport.updateResizeHandles(geometry, false);

			if (isPastBounds) {
				const isXAxis = isPastLeft || isPastRight;
				const newHandleId = isXAxis
					? ResizeHandleOppositeOf[this.handleId].x
					: ResizeHandleOppositeOf[this.handleId].y;
				this.handleId = newHandleId;

				this.initialGraphicsState.length = 0;
				const graphics = this.container.getGraphicChildren();
				for (const element of graphics) {
					this.initialGraphicsState.push({
						child: element,
						width: element.width,
						height: element.height,
						x: element.x,
						y: element.y,
					});
				}

				const { width, height, absMinX, absMaxY, absMaxX, absMinY } = this.container;
				this.initialContainerSize = { width, height, absMinX, absMaxY, absMaxX, absMinY };

				if (this.handleId < 4) {
					const { x, y } = this.viewport.resizeHandles[this.handleId];
					this.initialCursorPosition = new Point(x, y);
				} else {
					const { x, y } = this.viewport.resizeHitAreas[this.handleId - 4];
					this.initialCursorPosition = new Point(x, y);
				}
			}
		} catch (err) {
			if (err instanceof Error) {
				console.error('Unexpected error during resize :', err.message);
			}

			this._removeViewportResizeEvent();
		}
	};

	private _endResizeTransform = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		try {
			// Prevent an error when mouse up event and deletion event at the same time
			this.container.off('pointerup', this._endResizeTransform);
			this._removeViewportResizeEvent();

			this.initialGraphicsState.length = 0;
			this.initialContainerSize = null;
			this.initialCursorPosition = null;
			this.isResizing = false;

			this.viewport.resizeHandles.forEach((handle) => {
				handle.off('pointermove', this.handler);
			});

			this.viewport.resizeHitAreas.forEach((handle) => {
				handle.off('pointermove', this.handler);
			});

			this.handleId = null;
		} catch (err) {
			if (err instanceof Error) {
				console.error('Unexpected error during end resize :', err.message);
			}
		}
	};

	private _removeViewportResizeEvent = () => {
		this.viewport.off('pointerup', this._endResizeTransform);
		this.viewport.off('mouseleave', this._endResizeTransform);
		this.viewport.off('pointermove', this._updateResizeTransform);
		this.isResizing = false;
	};

	//! optimisation: This function does not handle well the decimal precision, it may break after a few iteratinos if the decimals is lower than 2
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
	}: ProportionScaleOptions) {
		// Calculate ratio of new box size to original box size
		const r_width = Math.max(0.1, parentPrimeWidth) / Math.max(0.1, parentInitialWidth);
		const r_height = Math.max(0.1, parentPrimeHeight) / Math.max(0.1, parentInitialHeight);

		// Calculate the prime x,y of the child relatively to the parent
		const x_prime = +(
			+(childInitialX - anchorX).toFixed(2) * r_width +
			+anchorX.toFixed(2)
		).toFixed(2);
		const y_prime = +(
			+(childInitialY - anchorY).toFixed(2) * r_height +
			+anchorY.toFixed(2)
		).toFixed(2);

		// Calculate the prime width,height of the child relatively to the parent
		const w_prime = +(childInitialWidth * r_width).toFixed(2);
		const h_prime = +(childInitialHeight * r_height).toFixed(2);

		return { x: x_prime, y: y_prime, width: w_prime, height: h_prime };
	}

	private _proportionalMirrorPosition({ anchor, childCurrentPos, childCurrentSize }) {
		const diff_origin = childCurrentPos - anchor;
		const reversed_pos = anchor - diff_origin;
		const mirror_pos = reversed_pos - childCurrentSize;

		return mirror_pos;
	}
}
