import { Container, FederatedPointerEvent, IDestroyOptions } from 'pixi.js';
import { ContainerManager } from './containerManager';

import { ModelGraphics, PluginContainer } from '../types/pixi-class';
import {
	ContainerTypeId,
	SerializedContainer,
	SerializedContainerBounds,
	SerializedGraphic,
} from '../types/pixi-serialize';
import { ViewportUI } from '../viewportUI';
import { LineBezier } from '../model/template';
import { BezierHandle } from '../types/pixi-enums';

interface AttachedContainer {
	containerUUID: string;
	handleId: BezierHandle;
}

export class LineContainer extends PluginContainer {
	protected readonly manager: ContainerManager;
	public readonly children: Array<LineBezier>;
	public readonly uuid: string;
	public readonly typeId: ContainerTypeId;
	public startContainer: AttachedContainer;
	public endContainer: AttachedContainer;

	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;

	public cursor: CSSStyleProperty.Cursor;
	public isAttachedToFrame: boolean;
	public tabNumberContext: number;
	public frameNumber: number;

	static registerContainer(
		viewport: ViewportUI,
		attributes: Partial<SerializedContainer>,
		children: Array<ModelGraphics>,
		remote: boolean,
	) {
		return new LineContainer(viewport, attributes, children, remote);
	}

	constructor(
		viewport: ViewportUI,
		attributes: Partial<SerializedContainer>,
		children: Array<ModelGraphics>,
		remote: boolean,
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

		this.startContainer = {
			containerUUID: undefined,
			handleId: undefined,
		}

		this.endContainer = {
			containerUUID: undefined,
			handleId: undefined,
		}

		this.on('pointerdown', this.onSelected);

		for (const element of children) {
			this.addChild(element);
		}

		// if (!remote && viewport.socketPlugin) {
		// 	viewport.socketPlugin.emit('ws-element-added', this.serializeData());
		// }
	}

	public destroy(options?: boolean | IDestroyOptions): void {
		this.children[0].destroy();
		super.destroy(options);
	}

	protected onSelected(e: FederatedPointerEvent) {
		if (e.forced || !this.interactive) return;
		e.stopPropagation();
		this.manager.selectContainer(this as any, e.originalEvent.shiftKey);
	}

	protected onChildrenChange(_length?: number): void {
		super.onChildrenChange(_length);
		if (!this.destroyed && this.children.length > 0) {
			this.updateAbsoluteBounds();
		}
	}

	protected updateAbsoluteBounds() {
		const { start, end } = this.children[0];

		this.absMinX = start.x < end.x ? start.x : end.x;
		this.absMinY = start.y < end.y ? start.y : end.y;
		this.absMaxX = start.x > end.x ? start.x : end.x;
		this.absMaxY = start.y > end.y ? start.y : end.y;
	}

	public getVertex() {
		if (!this.destroyed) {
			const { start, end } = this.children[0];
			return { start, end }
		}
	}

	public getGeometry() {
		if (!this.destroyed) {
			this.updateAbsoluteBounds();
			return {
				x: this.absMinX,
				y: this.absMinY,
				width: this.width,
				height: this.height,
			};
		} else {
			return null;
		}
	}

	public getGraphicChildren() {
		return [this.children[0]] as Array<ModelGraphics>;
	}

	public cloneToContainer(): Container {
		const cloned = new Container();

		for (const element of this.children) {
			const clonedChild = element.clone();
			clonedChild.position.copyFrom(element.position);
			cloned.addChild(clonedChild);
		}

		return cloned;
	}

	public serializeData(): SerializedContainer {
		const graphic = this.getGraphicChildren()[0];
		const graphicSerialized = graphic.serialized();

		return {
			uuid: this.uuid,
			typeId: this.typeId,
			anchors: {
				absMinX: this.absMinX,
				absMinY: this.absMinY,
				absMaxX: this.absMaxX,
				absMaxY: this.absMaxY,
			},
			properties: {
				cursor: this.cursor,
				interactive: this.interactive,
				tabNumberContext: this.tabNumberContext,
				isAttachedToFrame: this.isAttachedToFrame,
				frameNumber: this.frameNumber,
			},
			childs: [graphicSerialized],
		};
	}

	public serializeBounds(): SerializedContainerBounds {
		const graphic = this.getGraphicChildren()[0];
		const graphicSerialized = graphic.serializedBounds();

		return {
			uuid: this.uuid,
			anchors: {
				absMinX: this.absMinX,
				absMinY: this.absMinY,
				absMaxX: this.absMaxX,
				absMaxY: this.absMaxY,
			},
			childs: [graphicSerialized],
		};
	}

	public updateTreeBounds(serializedBounds: SerializedContainerBounds) {
		const graphic = this.getGraphicChildren()[0];
		const { absMinX, absMinY, absMaxX, absMaxY } = serializedBounds.anchors;
		const bounds = (serializedBounds.childs[0] as SerializedGraphic).bounds;

		this.absMinX = absMinX;
		this.absMinY = absMinY;
		this.absMaxX = absMaxX;
		this.absMaxY = absMaxY;

		graphic.position.set(bounds.x, bounds.y);
		graphic.width = bounds.width;
		graphic.height = bounds.height;
	}

	public attachContainer(containerUUID: string, ctx: "start" | "end", handleId: BezierHandle) {
		if(ctx === "start") {
			this.startContainer.containerUUID = containerUUID;
			this.startContainer.handleId = handleId;
			return;
		}

		if(ctx === "end") {
			this.endContainer.containerUUID = containerUUID;
			this.endContainer.handleId = handleId;
		}
	}

	public detachContainer(ctx: "start" | "end") {
		if(ctx === "start") {
			this.startContainer = {
				containerUUID: undefined,
				handleId: undefined,
			}
			return;
		}

		if(ctx === "end") {
			this.endContainer = {
				containerUUID: undefined,
				handleId: undefined,
			}
		}
	}
}