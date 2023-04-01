import { FederatedPointerEvent, Graphics } from 'pixi.js';
import { ContainerManager } from './containerManager';
import { ContainerContext, FrameContext, GraphicConstructor } from '../types/pixi-container-options';
import { PluginContainer } from '../types/pixi-class';

export class GenericContainer extends PluginContainer {
	protected readonly manager: ContainerManager;
	public readonly children: Array<Graphics>;
	public readonly id: string;

	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;
	
	public isAttachedToFrame: boolean;
	public frameNumber: number;

	constructor(context: ContainerContext, frameCtx: FrameContext) {
		super();

		this.id = "generic"
		this.cursor = "pointer";
		this.interactive = true;
		this.isAttachedToFrame = frameCtx.isAttached;
		this.frameNumber = frameCtx.to ?? -1;
		this.manager = context.manager;

		const { Graphic, attributes } = context.constructors as GraphicConstructor;
		const element = new Graphic(attributes);
		element.on("pointerdown", this.onSelected.bind(this));
		this.addChild(element);
	}

	protected onSelected(e: FederatedPointerEvent) {
		e.stopPropagation();
		this.manager.selectContainer(this, e.originalEvent.shiftKey);
	};

	protected onChildrenChange(_length?: number): void {
		super.onChildrenChange(_length);
		if(!this.destroyed) {
			this.updateAbsoluteBounds();
		}
	}

	protected updateAbsoluteBounds() {
		const { x, y, width, height } = this.children[0];

		this.absMinX = x;
		this.absMinY = y;
		this.absMaxX = x + width;
		this.absMaxY = y + height;
	}

	public getGeometry() {
		if(!this.destroyed) {
			this.updateAbsoluteBounds();
			return {
				x: this.absMinX,
				y: this.absMinY,
				width: this.width,
				height: this.height,
			}
		} else {
			return null;
		}
	}

	public getGraphicChildren() {
		return [this.children[0]];
	}
}