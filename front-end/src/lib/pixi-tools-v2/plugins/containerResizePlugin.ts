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
	GenericResize,
	OrthogonalResize,
} from '../types/pixi-enums';
import type { CanvasContainer, PluginContainer } from '../types/pixi-aliases';
import type { ContainerSize, InitialGraphicState } from '../types/pixi-container';
import { dragAttachedLines } from '../utils/dragAttachedLines';
import { ModelGraphics } from '../types/pixi-class';
import { ResizeRatioMetrics, ResizeMetrics, InitialResizeOptions, ParentOrthogonalPrimeOptions, ParentPrimeOptions, ProportionScaleOptions, ProportionLineScaleOptions, InitialLineResizeOptions } from '../types/pixi-resize';
import { LineBezier } from '../model/template';

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
			if(element instanceof LineBezier) {
				this.initialGraphicsState.push({
					child: element,
					width: element.width,
					height: element.height,
					x: element.x,
					y: element.y,
					start: { ...element.start },
					end: { ...element.end },
					startControl: { ...element.startControl },
					endControl: { ...element.endControl },
				});
			} else {
				this.initialGraphicsState.push({
					child: element,
					width: element.width,
					height: element.height,
					x: element.x,
					y: element.y,
				});
			}
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

	private _getParentPrimeSize = (options: ParentPrimeOptions) => {
		if(this.handleId === ResizeHandle.LT || this.handleId === ResizeHandle.RT) {
			if (this.handleId === ResizeHandle.LT) {
				return {
					parentPrimeWidth: options.initialWidth - options.dx,
					parentPrimeHeight: options.isShift
						? (options.initialWidth - options.dx) * options.ratioA
						: options.initialHeight - options.dy
				}
			} else {
				return {
					parentPrimeWidth: options.initialWidth + options.dx,
					parentPrimeHeight: options.isShift
						? (options.initialWidth + options.dx) * options.ratioA
						: options.initialHeight - options.dy
				}
			}
		} else if (this.handleId === ResizeHandle.LB || this.handleId === ResizeHandle.RB) {
			if (this.handleId === ResizeHandle.LB) {
				return {
					parentPrimeWidth: options.initialWidth - options.dx,
					parentPrimeHeight: options.isShift
						? (options.initialWidth - options.dx) / options.ratioB
						: options.initialHeight + options.dy
				}
			} else {
				return {
					parentPrimeWidth: options.initialWidth + options.dx,
					parentPrimeHeight: options.isShift
						? (options.initialWidth + options.dx) / options.ratioB
						: options.initialHeight + options.dy
				}
			}
		}

		return null;
	}

	private _getParentOrthogonalPrimeSize = (options: ParentOrthogonalPrimeOptions) => {
		if (this.handleId === ResizeHandle.T) {
			return {
				parentPrimeWidth: options.initialWidth,
				parentPrimeHeight: options.initialHeight - options.dy,
			}
		} else if (this.handleId === ResizeHandle.R) {
			return {
				parentPrimeWidth: options.initialWidth + options.dx,
				parentPrimeHeight: options.initialHeight,
			}
		} else if (this.handleId === ResizeHandle.B) {
			return {
				parentPrimeWidth: options.initialWidth,
				parentPrimeHeight: options.initialHeight + options.dy,
			}
		} else if (this.handleId === ResizeHandle.L) {
			return {
				parentPrimeWidth: options.initialWidth - options.dx,
				parentPrimeHeight: options.initialHeight,
			}
		}

		return null;
	}

	private _genericResize = (
		child: ModelGraphics,
		initialOptions: InitialResizeOptions,
		resizeMetrics: ResizeRatioMetrics,
		isShift: boolean,
	) => {
		const anchorX = this.handleId === ResizeHandle.LT || this.handleId === ResizeHandle.LB
			? this.container.absMaxX
			: this.container.absMinX

		const anchorY = this.handleId === ResizeHandle.LT || this.handleId === ResizeHandle.RT
			? this.container.absMaxY
			: this.container.absMinY

		const anchor = { anchorX, anchorY };
		const prime = this._getParentPrimeSize({
			...resizeMetrics,
			initialWidth: initialOptions.parentInitialWidth,
			initialHeight: initialOptions.parentInitialHeight,
			handleId: this.handleId,
			isShift,
		})

		if(child instanceof LineBezier) {
			const lineWidth = (Math.min(this.container.width, this.container.height) / 100) / 2;
			const minLineWidth = Math.max(0, lineWidth);

			const { startControl, endControl, start, end } = this._proportionalLineScale({
				...initialOptions,
				...anchor,
				...prime,
			})

			child.start = start;
			child.end = end;
			child.startControl = startControl;
			child.endControl = endControl;
			child.lineWidth = minLineWidth;
			child.draw();
		} else {
			const { x, y, width, height } = this._proportionalScale({
				...initialOptions,
				...anchor,
				...prime,
			});
	
			child.width = width;
			child.height = height;
			child.x = x;
			child.y = y;
		}
	}

	private _orthogonalResize = (
		child: ModelGraphics,
		initialOptions: InitialResizeOptions & InitialLineResizeOptions,
		resizeMetrics: ResizeMetrics,
	) => {
		const anchor = this.handleId === ResizeHandle.T || this.handleId === ResizeHandle.L
			? { anchorX: this.container.absMaxX, anchorY: this.container.absMaxY }
			: { anchorX: this.container.absMinX, anchorY: this.container.absMinY }

		const prime = this._getParentOrthogonalPrimeSize({
			...resizeMetrics,
			initialWidth: initialOptions.parentInitialWidth,
			initialHeight: initialOptions.parentInitialHeight,
			handleId: this.handleId,
		})

		if(child instanceof LineBezier) {
			const lineWidth = (Math.min(this.container.width, this.container.height) / 100) / 2;
			const minLineWidth = Math.max(0, lineWidth);

			const { startControl, endControl, start, end } = this._proportionalLineScale({
				...initialOptions,
				...anchor,
				...prime,
			})

			child.start = start;
			console.log(child.start)
			child.end = end;
			child.startControl = startControl;
			child.endControl = endControl;
			child.lineWidth = minLineWidth;
			child.draw();
		} else {
			const { x, y, width, height } = this._proportionalScale({
				...initialOptions,
				...anchor,
				...prime,
			});
	
			child.width = width;
			child.height = height;
			child.x = x;
			child.y = y;
		}
	}

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
				
			const { width: initialCtnWidth, height: initialCtnHeight, absMinX, absMaxX, absMinY, absMaxY  } = this.initialContainerSize;
			const ratioA = initialCtnHeight / initialCtnWidth;
			const ratioB = initialCtnWidth / initialCtnHeight;
			const initialOptions: InitialResizeOptions & InitialLineResizeOptions = {
				parentInitialWidth: initialCtnWidth,
				parentInitialHeight: initialCtnHeight,
			}

			const isPastLeft = LeftWall.includes(this.handleId) && cursorPosition.x < absMinX;
			const isPastRight = RightWall.includes(this.handleId) && cursorPosition.x > absMaxX;
			const isPastTop = TopWall.includes(this.handleId) && cursorPosition.y < absMinY;
			const isPastBottom = BottomWall.includes(this.handleId) && cursorPosition.y > absMaxY;
			const isPastBounds = isPastLeft || isPastRight || isPastBottom || isPastTop;

			for (let n = 0; n < this.initialGraphicsState.length; n++) {
				const { child } = this.initialGraphicsState[n];
				
				if(isPastBounds) {
					if(child instanceof LineBezier) continue;
					const sizeAndPos = isPastLeft || isPastRight ? [child.x, child.width] : [child.y, child.height];
					const anchor = isPastLeft ? absMinX : isPastRight ? absMaxX : isPastTop ? absMinY : absMaxY;

					const mirror = this._proportionalMirrorPosition({
						anchor: anchor,
						childCurrentPos: sizeAndPos[0],
						childCurrentSize: sizeAndPos[1],
					});

					if (isPastLeft || isPastRight) child.x = mirror;
					else child.y = mirror;

					continue;
				}

				if (child instanceof LineBezier) {
					const { start, end, startControl, endControl } = { ...this.initialGraphicsState[n] };

					initialOptions.childInitialStart = start;
					initialOptions.childInitialEnd = end;
					initialOptions.childInitialStartControl = startControl;
					initialOptions.childInitialEndControl = endControl;
				} else {
					const { x, y, width, height } = { ...this.initialGraphicsState[n] };

					initialOptions.childInitialX = x;
					initialOptions.childInitialY = y;
					initialOptions.childInitialWidth = width;
					initialOptions.childInitialHeight = height;
				}

				if(GenericResize.includes(this.handleId)) {
					this._genericResize(child, initialOptions, {
						dx, dy, ratioA, ratioB
					}, shift);
				} else if (OrthogonalResize.includes(this.handleId)) {
					this._orthogonalResize(child, initialOptions, {
						dx, dy
					});
				}

				if (child.typeId === 'framebox') {
					const frame = child.parent?.parent;
					if (frame instanceof FramedContainer) {
						dragAttachedLines(frame, this.viewport.socketPlugin);
						continue;
					}
				}

				const parent = child.parent as CanvasContainer;
				if (parent.typeId === 'wrap') continue;
				dragAttachedLines(parent, this.viewport.socketPlugin);
			}

			this._syncResize();
			const geometry = this.container.getGeometry();
			this.viewport.destroyBorder();
			this.viewport.createBorder({ ...geometry, scale: this.viewport.scaled });
			this.viewport.updateResizeHitAreas(geometry);
			this.viewport.updateResizeHandles(geometry, false);
			this.viewport.updateBezierHandles(geometry, false);

			if (isPastBounds) {
				this._assignNewGraphicState(isPastLeft || isPastRight);
			}
		} catch (err) {
			if (err instanceof Error) {
				console.error('Unexpected error during resize :', err.message);
			}

			this._removeViewportResizeEvent();
		}
	};

	private _syncResize = () => {
		if (this.container instanceof WrappedContainer) {
			for (const element of this.container.absoluteChildren) {
				if (element instanceof FramedContainer) {
					element.emit('moved', null);
				}
			}
		} else {
			if (this.container instanceof FramedContainer) {
				this.container.emit('moved', null);
			}

			dragAttachedLines(this.container, this.viewport.socketPlugin);
		}

		if (this.viewport.socketPlugin) {
			const containers =
				this.container instanceof WrappedContainer
					? this.container.absoluteChildren
					: [this.container];

			for (const container of containers) {
				container.getGeometry();
				this.viewport.socketPlugin.emit(
					'ws-element-updated',
					container.uuid,
					container.serializeBounds(),
				);
			}
		}
	}

	private _assignNewGraphicState = (isXAxis: boolean) => {
		const newHandleId = isXAxis
			? ResizeHandleOppositeOf[this.handleId].x
			: ResizeHandleOppositeOf[this.handleId].y;
		this.handleId = newHandleId;

		this.initialGraphicsState.length = 0;
		const graphics = this.container.getGraphicChildren();
		for (const element of graphics) {
			if(element instanceof LineBezier) {
				this.initialGraphicsState.push({
					child: element,
					width: element.width,
					height: element.height,
					x: element.x,
					y: element.y,
					start: { ...element.start },
					end: { ...element.end },
					startControl: { ...element.startControl },
					endControl: { ...element.endControl },
				});
			} else {
				this.initialGraphicsState.push({
					child: element,
					width: element.width,
					height: element.height,
					x: element.x,
					y: element.y,
				});
			}
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

		// Calculate the prime width, height of the child relatively to the parent
		const w_prime = +(childInitialWidth * r_width).toFixed(2);
		const h_prime = +(childInitialHeight * r_height).toFixed(2);

		return { x: x_prime, y: y_prime, width: w_prime, height: h_prime };
	}

	private _proportionalLineScale({
		parentInitialWidth,
		parentInitialHeight,
		parentPrimeWidth,
		parentPrimeHeight,
		childInitialStart,
		childInitialEnd,
		childInitialStartControl,
		childInitialEndControl,
		anchorX,
		anchorY,
	}: ProportionLineScaleOptions) {
		// Calculate ratio of new box size to original box size
		const r_width = Math.max(0.1, parentPrimeWidth) / Math.max(0.1, parentInitialWidth);
		const r_height = Math.max(0.1, parentPrimeHeight) / Math.max(0.1, parentInitialHeight);
	
		// Calculate the prime coordinates of the control points relatively to the parent
		const startControlPrime = {
			x: +(+(childInitialStartControl.x - anchorX).toFixed(2) * r_width + +anchorX.toFixed(2)).toFixed(2),
			y: +(+(childInitialStartControl.y - anchorY).toFixed(2) * r_height + +anchorY.toFixed(2)).toFixed(2)
		};
		const endControlPrime = {
			x: +(+(childInitialEndControl.x - anchorX).toFixed(2) * r_width + +anchorX.toFixed(2)).toFixed(2),
			y: +(+(childInitialEndControl.y - anchorY).toFixed(2) * r_height + +anchorY.toFixed(2)).toFixed(2)
		};
	
		// Calculate the prime coordinates of the line's start and end points relatively to the parent
		const startPrime = {
			x: +(+(childInitialStart.x - anchorX).toFixed(2) * r_width + +anchorX.toFixed(2)).toFixed(2),
			y: +(+(childInitialStart.y - anchorY).toFixed(2) * r_height + +anchorY.toFixed(2)).toFixed(2)
		};
		const endPrime = {
			x: +(+(childInitialEnd.x - anchorX).toFixed(2) * r_width + +anchorX.toFixed(2)).toFixed(2),
			y: +(+(childInitialEnd.y - anchorY).toFixed(2) * r_height + +anchorY.toFixed(2)).toFixed(2)
		};
	
		return {
			startControl: startControlPrime,
			endControl: endControlPrime,
			start: startPrime,
			end: endPrime,
		};
	}

	private _proportionalMirrorPosition({ anchor, childCurrentPos, childCurrentSize }) {
		const diff_origin = childCurrentPos - anchor;
		const reversed_pos = anchor - diff_origin;
		const mirror_pos = reversed_pos - childCurrentSize;

		return mirror_pos;
	}

	private _proportionalMirrorLinePosition(
		anchor: number,
		childCurrentStart: number,
		childCurrentStartControl: number,
		childCurrentEnd: number,
		childCurrentEndControl: number,
		childCurrentSize: number
	) {
		const diff_start_origin = childCurrentStart - anchor;
		const diff_end_origin = childCurrentEnd - anchor;
		const diff_start_control_origin = childCurrentStartControl - anchor;
		const diff_end_control_origin = childCurrentEndControl - anchor;

		const reversed_start = anchor - diff_start_origin;
		const reversed_end = anchor - diff_end_origin;
		const reversed_start_control = anchor - diff_start_control_origin;
		const reversed_end_control = anchor - diff_end_control_origin;

		const mirror_start = reversed_start - childCurrentSize;
		const mirror_end = reversed_end - childCurrentSize;
		const mirror_start_control = reversed_start_control - childCurrentSize;
		const mirror_end_control = reversed_end_control - childCurrentSize;

		return {
			start: mirror_start,
			end : mirror_end,
			startControl: mirror_start_control,
			endControl: mirror_end_control,
		};
	}
}
