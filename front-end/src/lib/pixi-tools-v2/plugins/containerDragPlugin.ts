import { EventBoundary, FederatedPointerEvent, Point } from "pixi.js";
import { FramedContainer } from "../class/framedContainer";
import { WrappedContainer } from "../class/wrappedContainer";
import { ViewportUI } from "../viewportUI";

import type { InitialResizeState } from "../types/pixi-container";
import type { PluginContainer } from "../types/pixi-aliases";


export class DragPlugin {
	protected readonly viewport: ViewportUI;
	protected readonly initialGraphicsState: Array<InitialResizeState> = [];
	protected readonly endHandler: (e: FederatedPointerEvent) => void;
	protected container: PluginContainer = null;
	protected initialCursorPosition: Point = null;
	protected isDragging: boolean = false;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
		this.endHandler = this._endDragging.bind(this);
	}

	public attach(container: PluginContainer) {
		this.container = container;
		this.container.on('pointerdown', this._initDragging);

		if(!this.viewport.selectionBoxActive) {
			// What's this shenanigans you may ask ?
			// This is a controlled fake event so that we can drag on the first pointerdown (selection)
			// .forced is used to prevent the trigger of other event registered with a pointerdown, but you have to define it manually.
			const eventBoundary = new EventBoundary(this.container);
			const fakeEvent = new FederatedPointerEvent(eventBoundary);
			fakeEvent.forced = true;
			fakeEvent.global = this.viewport.mouse;
			this.container.emit('pointerdown', fakeEvent);
		}
	}

	public detach() {
		if(this.isDragging) return;
		if(this.container) {
			this.container.off('pointerdown', this._initDragging);
			this._endDragging(null);
		}
		this.initialCursorPosition = null;
		this.container = null;
	}

	private _initDragging = (e: FederatedPointerEvent) => {
		if(e) e.stopPropagation();
		if(this.container === null) return;

		const graphics = this.container.getGraphicChildren();
		for(let n = 0; n < graphics.length; n++) {
			graphics[n].cursor = "grabbing";
			this.initialGraphicsState.push({
				child: graphics[n],
				width: graphics[n].width,
				height: graphics[n].height,
				x: graphics[n].x,
				y: graphics[n].y,
			})
		}

		this.initialCursorPosition = this.viewport.toWorld(e.global.clone());
		this.viewport.on('pointermove', this._updateDragging);
		this.viewport.on('pointerup', this.endHandler);
		this.container.on('pointermove', this._updateDragging);
		this.container.on('pointerup', this.endHandler);

		this.viewport.cursor = "grabbing";
		this.container.cursor = "grabbing";
	}

	private _updateDragging = (e: FederatedPointerEvent) => {
		if(e) e.stopPropagation();
		if(this.container === null) return;

		try { // Prevent an error when mouse move event and deletion event at the same time
			this.isDragging = true;
			const cursorPosition = this.viewport.toWorld(e.global.clone());
			const dx = (cursorPosition.x - this.initialCursorPosition.x);
			const dy = (cursorPosition.y - this.initialCursorPosition.y);

			for(let n = 0; n < this.initialGraphicsState.length; n++) {
				const { child, x, y } = this.initialGraphicsState[n];
				child.position.set(x + dx, y + dy);
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
				console.error("Unexpected error during drag :", err.message);
			}

			this._removeViewportDragEvent();
		}
	}

	private _endDragging(e: FederatedPointerEvent) {
		if(e) e.stopPropagation();
		if(this.container === null) return;

		try { // Prevent an error when mouse up event and deletion event at the same time
			this.container.off('pointerup', this.endHandler);
			this.container.off('pointermove', this._updateDragging);
			this._removeViewportDragEvent();
			
			this.initialGraphicsState.forEach((el) => {
				el.child.cursor = "pointer";
			})
			
			this.initialGraphicsState.length = 0;
			this.initialCursorPosition = null;
			this.container.cursor = "pointer";
			this.isDragging = false;
		} catch(err) {
			if(err instanceof Error) {
				console.error("Unexpected error during end drag :", err.message);
			}
		}
	}

	private _removeViewportDragEvent = () => {
		this.viewport.off('pointermove', this._updateDragging);
		this.viewport.off('pointerup', this.endHandler);
		this.viewport.cursor = "default";
		this.isDragging = false;
	}
}