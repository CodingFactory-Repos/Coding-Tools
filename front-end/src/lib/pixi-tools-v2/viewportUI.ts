import { IViewportOptions, Viewport } from "pixi-viewport";
import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
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



export class ViewportUI extends Viewport {
	protected readonly scene: Scene;
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
		this.manager = new ContainerManager(this);
		this.grid = new Grid({ color: 0x222327 });
		this.scene = scene;
		this.addChildAt(this.grid, 0);

		window.addEventListener('resize', this._onWindowResize);
		this.on('moved', this._onViewportMoved);
	
		this.on("pointerdown", (e: FederatedPointerEvent) => {
			const wrap = this.manager.wrappedContainer;
			const loc = wrap.toLocal(e.global);
			if(wrap.getBounds().contains(loc.x, loc.y)) return;
			else {
				this.manager.deselectAll();
				this.manager.detachPlugins();
			}
		})
	}

	private _onWindowResize() {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight;

		this.scene.renderer.resize(newWidth, newHeight);
		this.screenWidth = newWidth;
		this.screenHeight = newHeight;
		this.worldWidth = newWidth;
		this.worldHeight = newHeight;
	}

	private _onViewportMoved() {
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

	public offWindowResize() {
		window.removeEventListener('resize', this._onWindowResize);
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
		const scale = this.scaled;
		const size = 5 / scale;

		const handleScaledLeft = (x + size / 4);
		const handleScaledRight = (x - size / 4 + width);
		const handleScaledTop = (y + size / 4);
		const handleScaledBottom = (y - size / 4 + height);

		const handlePositions: Array<HandleOptions> = [
			{ x: handleScaledLeft,  y: handleScaledTop,    cursor: "nwse-resize", handleId: ResizeHandle.LT },
			{ x: handleScaledRight, y: handleScaledTop,    cursor: "nesw-resize", handleId: ResizeHandle.RT },
			{ x: handleScaledRight, y: handleScaledBottom, cursor: "nwse-resize", handleId: ResizeHandle.RB },
			{ x: handleScaledLeft,  y: handleScaledBottom, cursor: "nesw-resize", handleId: ResizeHandle.LB },
		]

		for (let n = 0; n < handlePositions.length; n++) {
			const { handleId, ...attr } = handlePositions[n];

			const handle = new Handle({
				...attr,
				color: 0xff00ff,
				radius: size,
				scale: scale,
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
			{ x: hitLineLeft,  y: hitLineTop,    endX: hitLineRight, endY: hitLineTop,    lineWidth: size, cursor: "ns-resize", handleId: ResizeHandle.T },
			{ x: hitLineRight, y: hitLineTop,    endX: hitLineRight, endY: hitLineBottom, lineWidth: size, cursor: "ew-resize", handleId: ResizeHandle.R },
			{ x: hitLineLeft,  y: hitLineBottom, endX: hitLineRight, endY: hitLineBottom, lineWidth: size, cursor: "ns-resize", handleId: ResizeHandle.B },
			{ x: hitLineLeft,  y: hitLineBottom, endX: hitLineLeft,  endY: hitLineTop,    lineWidth: size, cursor: "ew-resize", handleId: ResizeHandle.L },
		]

		for (let n = 0; n < hitAreaPosition.length; n++) {
			const { handleId, ...attr } = hitAreaPosition[n];

			const line = new HitArea({
				...attr,
				alpha: 0
			}, handleId);
			line.zIndex = 100;
			this.resizeHitAreas.push(line);
			this.addChildAt(line, this.children.length);
		}
	}

	public updateResizeHandles(attr: GraphicAttributes) {
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
			this.resizeHandles[n].position.set(positions[n].x, positions[n].y);
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
			{ x: hitLineLeft,  y: hitLineTop,    endX: hitLineRight, endY: hitLineTop,    lineWidth: size },
			{ x: hitLineRight, y: hitLineTop,    endX: hitLineRight, endY: hitLineBottom, lineWidth: size },
			{ x: hitLineLeft,  y: hitLineBottom, endX: hitLineRight, endY: hitLineBottom, lineWidth: size },
			{ x: hitLineLeft,  y: hitLineBottom, endX: hitLineLeft,  endY: hitLineTop,    lineWidth: size },
		]

		for (let n = 0; n < this.resizeHitAreas.length; n++) {
			this.resizeHitAreas[n].draw(positions[n]);
		}
	}
}