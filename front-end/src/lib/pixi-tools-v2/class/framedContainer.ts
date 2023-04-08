import { Container, FederatedPointerEvent, Text } from "pixi.js";
import { ContainerManager } from "./containerManager";
import { GenericContainer } from "./genericContainer";
import { Rectangle } from "../model/template";
import { ViewportUI } from "../viewportUI";

import type { ContainerContext, GraphicConstructor } from "../types/pixi-container";
import { FramedMainContainer, PluginContainer } from "../types/pixi-class";

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

	public isAttachedToFrame: boolean;
	public frameNumber: number;

	constructor(context: ContainerContext) {
		super();

		this.id = "frame";
		this.cursor = "pointer";
		this.interactive = true;
		this.viewport = context.viewport;
		this.manager = context.manager;

		// TODO: frameNumber will break with multi user, because the frame can be moved out of the viewport (ie. wrapped container)
		this.frameNumber = this.viewport.children.filter(el => el.id === "frame").length;

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
			...geometry,
			id: "framebox",
			color: 0xff00ff,
			scale: this.viewport.scaled,
		});
		this.mainContainer.addChildAt(this.frameBox, 0);

		this.boxTitle = new Text(`Frame ${this.frameNumber}`, { fontSize: 14, fill: 0xffffff });
		this.boxTitle.x = geometry.x;
		this.boxTitle.y = geometry.y - 30;
		this.titleContainer.cursor = "pointer";
		this.titleContainer.addChild(this.boxTitle);
		this.titleContainer.on("pointerdown", this.onSelected.bind(this));
		this.addChild(this.titleContainer);

		this.on("moved", () => {
			const geometry = this.getGeometry();
			this.boxTitle.x = geometry.x;
			this.boxTitle.y = geometry.y - 30;
		})
	}

	protected onSelected(e: FederatedPointerEvent) {
		if(e.forced || !this.interactive) return;
		e.stopPropagation();
		this.manager.selectContainer(this, e.originalEvent.shiftKey);
	}

	public updateAbsoluteBounds() {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = 0;
		let maxY = 0;

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
		const graphics = [];

		for(let n = 0; n < this.mainContainer.children.length; n++) {
			if(this.mainContainer.children[n].id === "framebox") {
				graphics.push(this.mainContainer.children[n]);
				continue;
			}
			graphics.push(this.mainContainer.children[n].getGraphicChildren());
		}

		return graphics.flat();
	}
}