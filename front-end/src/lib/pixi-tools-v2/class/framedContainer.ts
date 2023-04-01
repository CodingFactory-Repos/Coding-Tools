import { Container, FederatedPointerEvent, Text } from "pixi.js";
import { ContainerContext, GraphicConstructor } from "../types/pixi-container-options";
import { ContainerManager } from "./containerManager";
import { GenericContainer } from "./genericContainer";
import { Rectangle } from "../model/model-constructor/rectangle";
import { FramedMainContainer, PluginContainer } from "../types/pixi-class";
import { ViewportUI } from "../viewportUI";

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
		
		const geometry = this.getGeometry(false);
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
		this.titleContainer.addChild(this.boxTitle);
		this.titleContainer.on("pointerdown", this.onSelected.bind(this));
		this.addChild(this.titleContainer);
	}

	protected onSelected(e: FederatedPointerEvent) {
		e.stopPropagation();
		this.manager.selectContainer(this, e.originalEvent.shiftKey);
	}

	// TODO: Broken
	public updateAbsoluteBounds() {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = 0;
		let maxY = 0;

		for(let n = 0; n < this.mainContainer.children.length; n++) {
			if(this.mainContainer.children[n].id === "framebox") {
				const { x, y, width, height } = this.mainContainer.children[n];
				minX = x;
				minY = y;
				maxX = x + width;
				maxY = y + height;
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

	// TODO: Broken
	public getGeometry(padding: boolean = true) {
		if(!this.destroyed) {
			this.updateAbsoluteBounds();
			return {
				x: this.absMinX,
				y: this.absMinY - (padding ? 30 : 0),
				width: this.width,
				height: this.height,
			}
		} else {
			return null;
		}
	}

	// TODO: Broken
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