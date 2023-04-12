import { Container, FederatedPointerEvent, Graphics, Text } from "pixi.js";
import { ContainerManager } from "./containerManager";
import { GenericContainer } from "./genericContainer";
import { Rectangle } from "../model/template";
import { ViewportUI } from "../viewportUI";

import type { ContainerContext, GraphicConstructor } from "../types/pixi-container";
import { FramedMainContainer, PluginContainer } from "../types/pixi-class";
import { GraphicsId } from "../types/pixi-aliases";

export class FramedContainer extends PluginContainer {
	protected readonly viewport: ViewportUI;
	protected readonly manager: ContainerManager;
	protected readonly frameBox: Rectangle;
	protected readonly boxTitle: Text;
	public readonly children: Array<Container>;
	public readonly mainContainer: FramedMainContainer;
	public readonly titleContainer: Container;
	public readonly id: string;

	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;

	public tabNumberContext: number;
	public isAttachedToFrame: boolean;
	public frameNumber: number;

	constructor(context: ContainerContext) {
		super();

		this.id = "frame";
		this.cursor = "pointer";
		this.interactive = true;
		this.viewport = context.viewport;
		this.manager = context.manager;

		const allFrames = this.viewport.children.filter(child => child.id === "frame");
		const frameNumbers = allFrames.map((frame) => frame.frameNumber);
		this.frameNumber = [...new Set(frameNumbers)].reduce((acc, cur) => cur === acc ? acc + 1 : cur > acc ? acc : cur, 1);
		this.tabNumberContext = context.tabNumber;

		this.mainContainer = new FramedMainContainer();
		this.titleContainer = new Container();
		this.titleContainer.interactive = true;
		this.mainContainer.interactive = true;
		
		const constructors = context.constructors as Array<GraphicConstructor>;
		for(let i = 0; i < constructors.length; i++) {
			const genericContainer = new GenericContainer({
				...context,
				constructors: {
					Graphic: constructors[i].Graphic,
					attributes: constructors[i].attributes,
				}
			}, {
				isAttached: true,
				to: this.frameNumber,
			});
			this.mainContainer.addChild(genericContainer);
		}

		this.addChild(this.mainContainer);
		this.mainContainer.on("added", this.updateAbsoluteBounds.bind(this));
		
		const geometry = this.getGeometry();
		this.frameBox = new Rectangle({
			x: constructors[0].attributes.x,
			y: constructors[0].attributes.y,
			width: 400,
			height: 300,
			id: "framebox",
			color: 0xff00ff,
			scale: this.viewport.scaled,
		});
		this.frameBox.interactive = true;
		this.frameBox.on("pointerdown", this.onSelected.bind(this));
		this.mainContainer.addChildAt(this.frameBox, 0);

		this.boxTitle = new Text(`Frame ${this.frameNumber}`, { fontSize: 14, fill: 0xffffff });
		this.boxTitle.x = geometry.x;
		this.boxTitle.y = geometry.y - 30;
		this.titleContainer.cursor = "pointer";
		this.titleContainer.addChild(this.boxTitle);
		this.titleContainer.on("pointerdown", this.onSelected.bind(this));
		// This is added to the viewport for conveniance reason, it mess the resize because of its bounds otherwise.
		// But no worry, it's synched to the frame.
		this.viewport.addChild(this.titleContainer);

		this.on("moved", () => {
			const geometry = this.getGeometry();
			this.boxTitle.x = geometry.x;
			this.boxTitle.y = geometry.y - 30;
		})

		this.on("destroyed", () => {
			this.viewport.removeChild(this.titleContainer);
		})
	}

	protected onSelected(e: FederatedPointerEvent) {
		if(e.forced || !this.interactive) return;
		e.stopPropagation();
		this.manager.selectContainer(this, e.originalEvent.shiftKey);
	}

	public updateAbsoluteBounds() {
		let minX = Number.MAX_SAFE_INTEGER;
		let minY = Number.MAX_SAFE_INTEGER;
		let maxX = Number.MIN_SAFE_INTEGER;
		let maxY = Number.MIN_SAFE_INTEGER;

		for(let n = 0; n < this.mainContainer.children.length; n++) {
			if(this.mainContainer.children[n].id === "framebox") {
				const { x, y, width, height } = this.mainContainer.children[n];
				if(x < minX) minX = x;
				if(y < minY) minY = y;
				if(x + width > maxX) maxX = x + width;
				if(y + height > maxY) maxY = y + height;
				continue;
			}

			const geometry = this.mainContainer.children[n].getGeometry();
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
		if(!this.destroyed) {
			this.updateAbsoluteBounds();
			return {
				x: this.absMinX,
				y: this.absMinY,
				width: this.mainContainer.width,
				height: this.mainContainer.height,
			}
		} else {
			return null;
		}
	}

	public getGraphicChildren() {
		const graphics: Array<GraphicsId | Array<GraphicsId>> = [];

		for(let n = 0; n < this.mainContainer.children.length; n++) {
			const child = this.mainContainer.children[n];
			if(child.id === "framebox" && child instanceof Rectangle) {
				graphics.push(child);
				continue;
			}
			graphics.push(child.getGraphicChildren());
		}

		return graphics.flat();
	}

	public cloneToContainer(): Container {
		const cloned = new Container();

		this.mainContainer.children.forEach((child) => {
			if(child.id === "framebox" && child instanceof Rectangle) {
				const clonedChild = child.clone();
				clonedChild.position.copyFrom(child.position);
				cloned.addChild(clonedChild);
			} else {
				const clonedContainer = child.cloneToContainer();
				cloned.addChild(clonedContainer);
			}
		});

		return cloned;
	}

	public serializeData() {
		const childSerializedData = [];
		let frameBox: Rectangle;
		for(let n = 0; n < this.mainContainer.children.length; n++) {
			const child = this.mainContainer.children[n];
			if(child.id === "framebox" && child instanceof Rectangle) {
				frameBox = child;
			} else {
				childSerializedData.push(child.serializeData());
			}
		}

		const data = {
			id: "frame",
			x: this.absMinX,
			y: this.absMinY,
			x2: this.absMaxX,
			y2: this.absMaxY,
			cursor: this.cursor,
			interactive: this.interactive,
			tabNumberContext: this.tabNumberContext,
			isAttachedToFrame: this.isAttachedToFrame,
			frameNumber: this.frameNumber,
			background: {
				id: frameBox.id,
				x: frameBox.x,
				y: frameBox.y,
				width: frameBox.width,
				height: frameBox.height,
				cursor: frameBox.cursor,
				interactive: frameBox.interactive,
				color: frameBox.color
			},
			child: childSerializedData,
		}

		return data;
	}
}