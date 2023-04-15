import { Container, FederatedPointerEvent, Text } from "pixi.js";
import { ContainerManager } from "./containerManager";
import { Rectangle } from "../model/template";
import { ViewportUI } from "../viewportUI";

import { FramedMainContainer, ModelGraphics, PluginContainer } from "../types/pixi-class";
import { ContainerTypeId, SerializedContainer, SerializedGraphic } from "../types/pixi-serialize";
import { GenericContainer } from "./genericContainer";

export class FramedContainer extends PluginContainer {
	protected readonly manager: ContainerManager;
	protected readonly frameBox: Rectangle;
	protected readonly boxTitle: Text;
	public readonly children: Array<Container>;
	public readonly mainContainer: FramedMainContainer;
	public readonly titleContainer: Container;
	public readonly uuid: string;
	public readonly typeId: ContainerTypeId;

	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;

	public cursor: CSSStyleProperty.Cursor;
	public tabNumberContext: number;
	public isAttachedToFrame: boolean;
	public frameNumber: number;

	static registerContainer(
		viewport: ViewportUI,
		attributes: Partial<SerializedContainer>,
		children: Array<GenericContainer>,
		remote: boolean,
		background?: Rectangle
	) {
		return new FramedContainer(viewport, attributes, children, remote, background);
	}

	constructor(
		viewport: ViewportUI,
		attributes: Partial<SerializedContainer>,
		children: Array<GenericContainer>,
		remote: boolean,
		background?: Rectangle
	) {
		super();

		const { uuid, typeId, anchors, properties } = attributes;

		this.uuid = uuid;
		this.typeId = typeId as ContainerTypeId;
		this.cursor = properties.cursor;
		this.interactive = properties.interactive;
		this.tabNumberContext = properties.tabNumberContext;
		this.isAttachedToFrame = properties.isAttachedToFrame;
		this.frameNumber = properties.frameNumber;
		this.absMinX = anchors.absMinX;
		this.absMinY = anchors.absMinY;
		this.absMaxX = anchors.absMaxX;
		this.absMaxY = anchors.absMaxY;
		this.manager = viewport.manager;
		
		this.mainContainer = new FramedMainContainer();
		this.titleContainer = new Container();
		this.titleContainer.interactive = true;
		this.mainContainer.interactive = true;

		for(let n = 0; n < children.length; n++) {
			this.mainContainer.addChild(children[n]);
		}

		this.addChild(this.mainContainer);
		this.mainContainer.on("added", this.updateAbsoluteBounds.bind(this));
		this.mainContainer.addChildAt(background, 0);
		background.on("pointerdown", this.onSelected.bind(this));

		const geometry = this.getGeometry();
		this.boxTitle = new Text(`Frame ${this.frameNumber}`, { fontSize: 14, fill: 0xffffff });
		this.boxTitle.x = geometry.x;
		this.boxTitle.y = geometry.y - 30;
		this.titleContainer.cursor = "pointer";
		this.titleContainer.addChild(this.boxTitle);
		this.titleContainer.on("pointerdown", this.onSelected.bind(this));
		viewport.addChild(this.titleContainer);

		this.on("moved", () => {
			const geometry = this.getGeometry();
			this.boxTitle.x = geometry.x;
			this.boxTitle.y = geometry.y - 30;
		})

		this.on("destroyed", () => {
			viewport.removeChild(this.titleContainer);
		})

		if(viewport.socketPlugin) {
			viewport.socketPlugin.emit("ws-element-added", this, remote);
		}
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
			const child = this.mainContainer.children[n];

			if (child instanceof Rectangle) {
				const { x, y, width, height } = child;
				if(x < minX) minX = x;
				if(y < minY) minY = y;
				if(x + width > maxX) maxX = x + width;
				if(y + height > maxY) maxY = y + height;

			} else if (child instanceof GenericContainer) {
				const geometry = child.getGeometry();
				if(geometry === null) continue;

				const { x, y, width, height } = geometry;

				if(x < minX) minX = x;
				if(y < minY) minY = y;
				if(x + width > maxX) maxX = x + width;
				if(y + height > maxY) maxY = y + height;
			}
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
		const graphics: Array<ModelGraphics | Array<ModelGraphics>> = [];

		for(let n = 0; n < this.mainContainer.children.length; n++) {
			const child = this.mainContainer.children[n];
			if (child instanceof Rectangle) {
				graphics.push(child);

			} else if (child instanceof GenericContainer) {
				graphics.push(child.getGraphicChildren());
			}
		}

		return graphics.flat();
	}

	public cloneToContainer(): Container {
		const cloned = new Container();

		this.mainContainer.children.forEach((child) => {
			if(child instanceof Rectangle) {
				const clonedChild = child.clone();
				clonedChild.position.copyFrom(child.position);
				cloned.addChild(clonedChild);

			} else if(child instanceof GenericContainer) {
				const clonedContainer = child.cloneToContainer();
				cloned.addChild(clonedContainer);
			}
		});

		return cloned;
	}

	public serializeData(): SerializedContainer {
		const genericContainerSerialized: Array<SerializedContainer> = [];
		let backgroundSerialized: SerializedGraphic;

		for(let n = 0; n < this.mainContainer.children.length; n++) {
			const child = this.mainContainer.children[n];
			if(child instanceof Rectangle) {
				backgroundSerialized = child.serialized();
			} else if(child instanceof GenericContainer) {
				genericContainerSerialized.push(child.serializeData());
			}
		}
		
		return {
			uuid: this.uuid,
			typeId: this.typeId,
			anchors: {
				absMinX: this.absMinX,
				absMinY: this.absMinY,
				absMaxX: this.absMaxX,
				absMaxY: this.absMaxY,
			},
			background: backgroundSerialized,
			properties: {
				cursor: this.cursor,
				interactive: this.interactive,
				tabNumberContext: this.tabNumberContext,
				isAttachedToFrame: this.isAttachedToFrame,
				frameNumber: this.frameNumber,
			},
			childs: genericContainerSerialized,
		}
	}
}