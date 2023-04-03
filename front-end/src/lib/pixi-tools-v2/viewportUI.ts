import { IViewportOptions, Viewport } from "pixi-viewport";
import { FederatedPointerEvent } from "pixi.js";
import { Scene } from "./scene";
import { Stage } from "../pixi-tools/types";
import { ContainerManager } from "./class/containerManager";
import { Border } from "./model/model-constructor/border";
import { GraphicAttributes } from "./types/pixi-container-options";
import { ResizeHandle } from "./types/pixi-enums";
import { Handle } from "./model/model-constructor/handle";
import { HandleOptions, HitAreaOptions } from "./types/pixi-ui-options";
import { HitArea } from "./model/model-constructor/hitArea";
import { Grid } from "./model/model-constructor/grid";
import { ViewportZoomPlugin } from "./plugins/viewportZoomPlugin";


export class ViewportUI extends Viewport {
	protected readonly scene: Scene;
	public readonly zoomPlugin: ViewportZoomPlugin;
	public readonly manager: ContainerManager;
	public readonly resizeHandles: Array<Handle> = [];
	public readonly lineHandles: Array<Handle> = [];
	public readonly resizeHitAreas: Array<HitArea> = [];
	public readonly parent: Stage;
	public readonly grid: Grid;
	public border: Border = null;

	constructor(options: IViewportOptions, scene: Scene) {
		super(options);

		this.drag().pinch({ percent: 2 }).wheel().decelerate();
		this.scene = scene;

		this.manager = new ContainerManager(this);
		this.zoomPlugin = new ViewportZoomPlugin(this, this.manager);
		this.grid = new Grid({ color: 0x27282d });
		this.addChildAt(this.grid, 0);

		window.addEventListener('resize', this._onWindowResized.bind(this));
		this.on('moved', this._onViewportMoved);
		this.on('zoomed', this._onViewportZoomed);
		this.on("pointerdown", this._onViewportUnselect);
	}

	public offWindowResized() {
		window.removeEventListener('resize', this._onWindowResized);
	}

	private _onWindowResized() {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight - this.scene.heightOffset;

		this.scene.renderer.resize(newWidth, newHeight);
		this.screenWidth = newWidth;
		this.screenHeight = newHeight;
		this.worldWidth = newWidth;
		this.worldHeight = newHeight;

		this.drawGrid();
	}

	private _onViewportMoved() {
		this.drawGrid();
	}

	private _onViewportZoomed() {
		this.zoomPlugin.updateZoomScale();

		if(this.manager.isActive) {
			const size = this.manager.getSelectedSize();

			if(this.border) {
				this.border.draw({
					...size,
					x: this.border.x,
					y: this.border.y,
					scale: this.scaled
				})
			}

			if(this.resizeHandles?.length > 0) {
				this.updateResizeHandles({
					...size,
					x: this.border.x,
					y: this.border.y,
				}, true);
			}

			if(this.resizeHitAreas?.length > 0) {
				this.updateResizeHitAreas({
					...size,
					x: this.border.x,
					y: this.border.y,
				})
			}
		}
	}

	private _onViewportUnselect(e: FederatedPointerEvent) {
		const wrap = this.manager.wrappedContainer;
		const loc = wrap.toLocal(e.global);
		if(wrap.getBounds().contains(loc.x, loc.y)) return;
		else {
			this.manager.deselectAll();
			this.manager.detachPlugins();
		}
	}

	public drawGrid() {
		if (this.scaled > 5) {
			this.grid.draw({
				width: this.worldScreenWidth,
				height: this.worldScreenHeight,
				scale: this.scaled,
				left: this.left,
				top: this.top,
			});
		} else {
			this.grid.purge();
		}
	}

	public destroyBorder() {
		if(this.border) {
			this.border.destroy();
			this.border = null;
		}
	}

	public destroyResizeHandles() {
		if(this.resizeHandles.length) {
			this.resizeHandles.forEach((handle) => { handle.destroy() });
			this.resizeHandles.length = 0;
		}
	}

	public destroyLineHandles() {
		if(this.lineHandles.length) {
			this.lineHandles.forEach((handle) => { handle.destroy() });
			this.lineHandles.length = 0;
		}
	}

	public destroyResizeHitArea() {
		if(this.resizeHitAreas.length) {
			this.resizeHitAreas.forEach((hit) => { hit.destroy() });
			this.resizeHitAreas.length = 0;
		}
	}

	public createBorder(attr: GraphicAttributes) {
		this.border = new Border(attr);
		this.border.zIndex = 10;
		this.addChildAt(this.border, this.children.length - 8 > 0 ? this.children.length - 8 : this.children.length);
	}

	public createResizeHandles(x: number, y: number, width: number, height: number) {
		const size = 5;
		const offset = size / this.scaled;

		const scaledLeft = (x + offset / 4);
		const scaledRight = (x - offset / 4 + width);
		const scaledTop = (y + offset / 4);
		const scaledBottom = (y - offset / 4 + height);

		const handlePositions: Array<HandleOptions> = [
			{ x: scaledLeft,  y: scaledTop,    cursor: "nwse-resize", handleId: ResizeHandle.LT },
			{ x: scaledRight, y: scaledTop,    cursor: "nesw-resize", handleId: ResizeHandle.RT },
			{ x: scaledRight, y: scaledBottom, cursor: "nwse-resize", handleId: ResizeHandle.RB },
			{ x: scaledLeft,  y: scaledBottom, cursor: "nesw-resize", handleId: ResizeHandle.LB },
		]

		for (let n = 0; n < handlePositions.length; n++) {
			const { handleId, ...attr } = handlePositions[n];

			const handle = new Handle({
				...attr,
				color: 0xd5d5d5,
				radius: size,
				scale: this.scaled,
			}, handleId);

			handle.zIndex = 100;
			this.resizeHandles.push(handle);
			this.addChildAt(handle, this.children.length);
		}
	}

	public createResizeHitAreas(x: number, y: number, width: number, height: number) {
		const scale = this.scaled;
		const size = 5 / scale;

		const hitLineLeft = x;
		const hitLineRight = x + width;
		const hitLineTop = y;
		const hitLineBottom = y + height;

		const hitAreaPosition: Array<HitAreaOptions> = [
			{ x: hitLineLeft,  y: hitLineTop,    endX: hitLineRight, endY: hitLineTop,    cursor: "ns-resize", handleId: ResizeHandle.T },
			{ x: hitLineRight, y: hitLineTop,    endX: hitLineRight, endY: hitLineBottom, cursor: "ew-resize", handleId: ResizeHandle.R },
			{ x: hitLineLeft,  y: hitLineBottom, endX: hitLineRight, endY: hitLineBottom, cursor: "ns-resize", handleId: ResizeHandle.B },
			{ x: hitLineLeft,  y: hitLineBottom, endX: hitLineLeft,  endY: hitLineTop,    cursor: "ew-resize", handleId: ResizeHandle.L },
		]

		for (let n = 0; n < hitAreaPosition.length; n++) {
			const { handleId, ...attr } = hitAreaPosition[n];

			const line = new HitArea({
				...attr,
				alpha: 0,
				lineWidth: size,
				scale: scale,
			}, handleId);
			line.zIndex = 100;
			this.resizeHitAreas.push(line);
			this.addChildAt(line, this.children.length);
		}
	}

	public updateResizeHandles(attr: GraphicAttributes, redraw: boolean) {
		const scale = this.scaled;
		const size = 5 / scale;

		const { x, y, width, height } = attr;

		const scaledLeft = (x + size / 4);
		const scaledRight = (x - size / 4 + width);
		const scaledTop = (y + size / 4);
		const scaledBottom = (y - size / 4 + height);

		const positions = [
			{ x: scaledLeft,  y: scaledTop },
			{ x: scaledRight, y: scaledTop },
			{ x: scaledRight, y: scaledBottom },
			{ x: scaledLeft,  y: scaledBottom },
		]
		
		for (let n = 0; n < this.resizeHandles.length; n++) {
			if(redraw) this.resizeHandles[n].draw({...positions[n], scale: scale });
			else this.resizeHandles[n].position.set(positions[n].x, positions[n].y);
		}
	}

	public updateResizeHitAreas(attr: GraphicAttributes) {
		const scale = this.scaled;
		const size = 5 / scale;

		const { x, y, width, height } = attr;

		const hitLineLeft = x;
		const hitLineRight = x + width;
		const hitLineTop = y;
		const hitLineBottom = y + height;

		const positions = [
			{ x: hitLineLeft,  y: hitLineTop,    endX: hitLineRight, endY: hitLineTop,   },
			{ x: hitLineRight, y: hitLineTop,    endX: hitLineRight, endY: hitLineBottom },
			{ x: hitLineLeft,  y: hitLineBottom, endX: hitLineRight, endY: hitLineBottom },
			{ x: hitLineLeft,  y: hitLineBottom, endX: hitLineLeft,  endY: hitLineTop,   },
		]

		for (let n = 0; n < this.resizeHitAreas.length; n++) {
			this.resizeHitAreas[n].draw({
				...positions[n],
				lineWidth: size,
				scale: scale,
			});
		}
	}
}