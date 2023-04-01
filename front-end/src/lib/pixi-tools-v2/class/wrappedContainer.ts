import { BoundsContainer } from "../types/pixi-class";
import { CanvasContainer } from "../types/pixi-container-options";
import { ViewportUI } from "../viewportUI";
import { FramedContainer } from "./framedContainer";


export class WrappedContainer extends BoundsContainer {
	protected readonly viewport: ViewportUI;
	public readonly children: Array<CanvasContainer>;
	public readonly id: string;

	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;

	constructor(viewport: ViewportUI) {
		super();

		this.id = "wrap";
		this.cursor = "pointer";
		this.interactive = true;
		this.viewport = viewport;
	}

	public restoreOriginChildren() {
		const framed = this.children.filter(ctn => ctn.isAttachedToFrame);
		for(let n = 0; n < framed.length; n++) {
			const frame = this.viewport.children.find(ctn => ctn.id === "frame" && ctn.frameNumber === framed[n].frameNumber) as FramedContainer;
			if(frame) frame.mainContainer.addChild(framed[n]);
		}

		if(this.children.length > 0) {
			this.viewport.addChild(...this.children);
			this.viewport.removeChild(this);
		}
	}

	protected onChildrenChange(_length?: number): void {
		super.onChildrenChange(_length);
		this.updateAbsoluteBounds();
	}

	protected updateAbsoluteBounds() {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = 0;
		let maxY = 0;

		for(let n = 0; n < this.children.length; n++) {
			const geometry = this.children[n].getGeometry();
			if(geometry === null) continue;

			const { x, y, width, height } = geometry;

			if(x < minX) minX = x;
			if(y < minY) minY = y;
			if(x + width > maxX) maxX = x + width;
			if(y + height > maxY) maxY = y + height;
		}

		this.absMinX = minX;
		this.absMinY = minY;
		this.absMaxX = maxX;
		this.absMaxY = maxY;
	}

	public getGeometry() {
		this.updateAbsoluteBounds();
		return {
			x: this.absMinX,
			y: this.absMinY,
			width: this.width,
			height: this.height,
		}
	}

	public getGraphicChildren() {
		const graphics = [];

		for(let n = 0; n < this.children.length; n++) {
			graphics.push(this.children[n].getGraphicChildren());
		}

		return graphics.flat();
	}
}