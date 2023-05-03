import { Container, FederatedPointerEvent, IDestroyOptions, Text } from 'pixi.js';
import { ContainerManager } from './containerManager';
import { Rectangle } from '../model/template';
import { ViewportUI } from '../viewportUI';

import { FramedMainContainer, ModelGraphics, PluginContainer, TitleContainer } from '../types/pixi-class';
import { ContainerTypeId, SerializedContainer, SerializedContainerBounds, SerializedGraphic, SerializedGraphicBounds } from '../types/pixi-serialize';
import { GenericContainer } from './genericContainer';
import { CanvasContainer } from '../types/pixi-aliases';

export class FramedContainer extends PluginContainer {
	protected readonly manager: ContainerManager;
	protected readonly frameBox: Rectangle;
	protected readonly boxTitle: Text;
	protected readonly viewport: ViewportUI;
	public readonly children: Array<Container>;
	public readonly mainContainer: FramedMainContainer;
	public readonly titleContainer: TitleContainer;
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
		background?: Rectangle,
	) {
		return new FramedContainer(viewport, attributes, children, remote, background);
	}

	constructor(
		viewport: ViewportUI,
		attributes: Partial<SerializedContainer>,
		children: Array<GenericContainer>,
		remote: boolean,
		background?: Rectangle,
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
		this.viewport = viewport;
		this.frameBox = background;

		this.mainContainer = new FramedMainContainer();
		this.titleContainer = new TitleContainer();
		this.titleContainer.tabNumberContext = this.frameNumber;
		this.titleContainer.interactive = true;
		this.mainContainer.interactive = true;

		for (const element of children) {
			this.mainContainer.addChild(element);
		}

		this.addChild(this.mainContainer);
		this.mainContainer.on('added', this.updateAbsoluteBounds.bind(this));
		this.mainContainer.addChildAt(background, 0);
		background.on('pointerdown', this.onSelected.bind(this));

		const geometry = this.getGeometry();
		this.boxTitle = new Text(`Frame ${this.frameNumber}`, { fontSize: 14, fill: 0xffffff });
		this.boxTitle.x = geometry.x;
		this.boxTitle.y = geometry.y - 30;
		this.titleContainer.cursor = 'pointer';
		this.titleContainer.addChild(this.boxTitle);
		this.titleContainer.on('pointerdown', this.onSelected.bind(this));
		viewport.addChild(this.titleContainer);

		background.on('moved', this.onMoved.bind(this));
		this.on('moved', this.onMoved);

		this.on('destroyed', () => {
			viewport.removeChild(this.titleContainer);
		});

		this.mainContainer.on('childAdded', this.onMoved.bind(this));
		this.mainContainer.on('childRemoved', this.onMoved.bind(this));

		if (!remote && viewport.socketPlugin) {
			viewport.socketPlugin.emit('ws-element-added', this.serializeData());
		}
	}

	public destroy(options?: boolean | IDestroyOptions): void {
		this.boxTitle.destroy();
		this.mainContainer.destroy();
		this.titleContainer.destroy();
		super.destroy(options);
	}

	protected onMoved() {
		const geometry = this.getGeometry();
		this.boxTitle.x = geometry.x;
		this.boxTitle.y = geometry.y - 30;
	}

	protected onSelected(e: FederatedPointerEvent) {
		if (e.forced || !this.interactive) return;
		if (e.target === this.frameBox && this.listeners('pointerdown').length > 0) return;
		e.stopPropagation();
		this.manager.selectContainer(this, e.originalEvent.shiftKey);
	}

	public addNestedChild(container: CanvasContainer, frameNumber: number, remote = false) {
		container.alpha = 1;
		if(this.mainContainer.children.some((el) => el.uuid === container.uuid)) return;

		container.isAttachedToFrame = true;
		container.frameNumber = frameNumber;
		this.mainContainer.addChild(container);

		if(!remote && this.viewport.socketPlugin) {
			this.viewport.socketPlugin.emit("ws-frame-child-added", this.uuid, container.uuid, this.serializeData());
		}
	}

	public removeNestedChild(container: CanvasContainer, index: number, remote = false) {
		if(this.mainContainer.children.find(el => el.uuid === container.uuid) === undefined) return;

		container.isAttachedToFrame = false;
		container.frameNumber = -1;
		this.mainContainer.removeChild(container);
		this.viewport.addChildAt(container, index);

		if(!remote && this.viewport.socketPlugin) {
			this.viewport.socketPlugin.emit("ws-frame-child-removed", this.uuid, this.serializeData(), container.serializeData());
		}
	}

	public updateAbsoluteBounds() {
		let minX = Number.MAX_SAFE_INTEGER;
		let minY = Number.MAX_SAFE_INTEGER;
		let maxX = Number.MIN_SAFE_INTEGER;
		let maxY = Number.MIN_SAFE_INTEGER;

		for (const element of this.mainContainer.children) {
			if (element instanceof Rectangle) {
				const { x, y, width, height } = element;
				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x + width > maxX) maxX = x + width;
				if (y + height > maxY) maxY = y + height;
			} else if (element instanceof GenericContainer) {
				const geometry = element.getGeometry();
				if (geometry === null) continue;

				const { x, y, width, height } = geometry;

				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x + width > maxX) maxX = x + width;
				if (y + height > maxY) maxY = y + height;
			}
		}

		this.absMinX = minX;
		this.absMinY = minY;
		this.absMaxX = maxX;
		this.absMaxY = maxY;
	}

	public getGeometry() {
		if (!this.destroyed) {
			this.updateAbsoluteBounds();
			return {
				x: this.absMinX,
				y: this.absMinY,
				width: this.mainContainer.width,
				height: this.mainContainer.height,
			};
		} else {
			return null;
		}
	}

	public getGraphicChildren() {
		const graphics: Array<ModelGraphics | Array<ModelGraphics>> = [];

		for (const element of this.mainContainer.children) {
			if (element instanceof Rectangle) {
				graphics.push(element);
			} else if (element instanceof GenericContainer) {
				graphics.push(element.getGraphicChildren());
			}
		}

		return graphics.flat();
	}

	public cloneToContainer(): Container {
		const cloned = new Container();

		for (const element of this.mainContainer.children) {
			if (element instanceof Rectangle) {
				const clonedChild = element.clone();
				clonedChild.position.copyFrom(element.position);
				cloned.addChild(clonedChild);
			} else if (element instanceof GenericContainer) {
				const clonedContainer = element.cloneToContainer();
				cloned.addChild(clonedContainer);
			}
		}

		return cloned;
	}

	public serializeData(): SerializedContainer {
		const genericContainerSerialized: Array<SerializedContainer> = [];
		let backgroundSerialized: SerializedGraphic;

		for (const element of this.mainContainer.children) {
			if (element instanceof Rectangle) {
				backgroundSerialized = element.serialized();
			} else if (element instanceof GenericContainer) {
				genericContainerSerialized.push(element.serializeData());
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
		};
	}

	public serializeBounds(): SerializedContainerBounds {
		const genericContainerSerializedBounds: Array<SerializedContainerBounds> = [];
		let backgroundSerialized: SerializedGraphicBounds;

		for (const element of this.mainContainer.children) {
			if (element instanceof Rectangle) {
				backgroundSerialized = element.serializedBounds();
			} else if (element instanceof GenericContainer) {
				genericContainerSerializedBounds.push(element.serializeBounds());
			}
		}

		return {
			uuid: this.uuid,
			anchors: {
				absMinX: this.absMinX,
				absMinY: this.absMinY,
				absMaxX: this.absMaxX,
				absMaxY: this.absMaxY,
			},
			background: {
				bounds: backgroundSerialized.bounds
			},
			childs: genericContainerSerializedBounds
		}
	}

	public updateTreeBounds(serializedBounds: SerializedContainerBounds) {
		const { absMinX, absMinY, absMaxX, absMaxY } = serializedBounds.anchors;
		const bounds = serializedBounds.background.bounds;
		
		this.absMinX = absMinX;
		this.absMinY = absMinY;
		this.absMaxX = absMaxX;
		this.absMaxY = absMaxY;

		this.frameBox.position.set(bounds.x, bounds.y);
		this.frameBox.width = bounds.width;
		this.frameBox.height = bounds.height;
	}

	get frameBoxBounds() {
		return this.frameBox.getBounds();
	}
}
