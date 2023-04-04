import { EventBoundary, FederatedPointerEvent, Point } from "pixi.js";
import { PluginContainer } from "../types/pixi-class";
import { InitialResizeState } from "../types/pixi-container-options";
import { ViewportUI } from "../viewportUI";


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
		
		// What now ? Well, welcome to event hell where side effects might happen
		this._endDragging(null);

		this.container.on('pointerdown', this._initDragging);

		if(!this.viewport.selectionBoxActive) {
			// What's this shenanigans you may ask ?
			// This is a controlled fake event so that we can drag on the first pointerdown (selection)
			const eventBoundary = new EventBoundary(this.container);
			const fakeEvent = new FederatedPointerEvent(eventBoundary);
			fakeEvent.forced = true;
			fakeEvent.global = this.viewport.mouse;
			this.container.emit('pointerdown', fakeEvent);
		}
	}

	public detach() {
		if(this.isDragging) return;

		// Ensure that the events are removed
		if(this.container) {
			this.container.off('pointerdown', this._initDragging);
			this._endDragging(null);
		}

		this.container = null;
		this.initialCursorPosition = null;
	}

	private _initDragging = (e: FederatedPointerEvent) => {
		e.stopPropagation();

		// TODO: Types
		const graphics: any[] = this.container.getGraphicChildren();
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
		e.stopPropagation();
		this.isDragging = true;
		const cursorPosition = this.viewport.toWorld(e.global.clone());
		const dx = (cursorPosition.x - this.initialCursorPosition.x);
		const dy = (cursorPosition.y - this.initialCursorPosition.y);

		for(let n = 0; n < this.initialGraphicsState.length; n++) {
			const { child, x, y } = this.initialGraphicsState[n];
			child.position.set(x + dx, y + dy);
		}

		const geometry = this.container.getGeometry();
		this.viewport.destroyBorder();
		this.viewport.createBorder({ ...geometry, scale: this.viewport.scaled });
		this.viewport.updateResizeHitAreas(geometry);
		this.viewport.updateResizeHandles(geometry, false);
	}

	private _endDragging(e: FederatedPointerEvent) {
		if(e) e.stopPropagation();
		this.isDragging = false;
		this.viewport.off('pointermove', this._updateDragging);
		this.viewport.off('pointerup', this.endHandler);
		this.container.off('pointerup', this.endHandler);
		this.container.off('pointermove', this._updateDragging);

		this.initialGraphicsState.forEach((el) => {
			el.child.cursor = "pointer";
		})

		this.initialGraphicsState.length = 0;
		this.initialCursorPosition = null;

		this.viewport.cursor = "default";
		this.container.cursor = "pointer";
	}
}