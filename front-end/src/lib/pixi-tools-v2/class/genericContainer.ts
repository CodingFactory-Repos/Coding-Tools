import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { ContainerManager } from './containerManager';

import { PluginContainer } from '../types/pixi-class';
import type { ContainerContext, FrameContext, GraphicConstructor } from '../types/pixi-container';
import { GraphicsId } from '../types/pixi-aliases';

export class GenericContainer extends PluginContainer {
	protected readonly manager: ContainerManager;
	public readonly children: Array<Graphics>;
	public readonly id: string;

	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;
	
	public tabNumberContext = null;
	public isAttachedToFrame: boolean;
	public frameNumber: number;

	constructor(context: ContainerContext, frameCtx: FrameContext) {
		super();

		this.id = "generic"
		this.cursor = "pointer";
		this.interactive = true;
		this.tabNumberContext = context.tabNumber;
		this.isAttachedToFrame = frameCtx.isAttached;
		this.frameNumber = frameCtx.to ?? -1;
		this.manager = context.manager;

		const { Graphic, attributes } = context.constructors as GraphicConstructor;
		const element = new Graphic(attributes);
		this.on("pointerdown", this.onSelected);
		this.addChild(element);
	}

	protected onSelected(e: FederatedPointerEvent) {
		if(e.forced || !this.interactive) return;
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
		return [this.children[0]] as Array<GraphicsId>;
	}

	public cloneToContainer(): Container {
		const cloned = new Container();

		this.children.forEach((child) => {
			const clonedChild = child.clone();
			clonedChild.position.copyFrom(child.position)
			cloned.addChild(clonedChild);
		});

		return cloned;
	}

	public serializeData() {
		const graphic = this.getGraphicChildren()[0];

		const data = {
			id: "generic",
			x: this.absMinX,
			y: this.absMinY,
			x2: this.absMaxX,
			y2: this.absMaxY,
			cursor: this.cursor,
			interactive: this.interactive,
			tabNumberContext: this.tabNumberContext,
			isAttachedToFrame: this.isAttachedToFrame,
			frameNumber: this.frameNumber,
			child: [
				{
					id: graphic.id,
					x: graphic.x,
					y: graphic.y,
					width: graphic.width,
					height: graphic.height,
					cursor: graphic.cursor,
					interactive: graphic.interactive,
					color: graphic.color
				}
			]
		}

		return data;
	}
}