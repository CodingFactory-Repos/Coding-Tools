import { Container, EventBoundary, FederatedPointerEvent, IDestroyOptions } from 'pixi.js';
import { ContainerManager } from './containerManager';

import { ModelGraphics, PluginContainer } from '../types/pixi-class';
import {
	ContainerTypeId,
	SerializedColorimetry,
	SerializedContainer,
	SerializedContainerBounds,
	SerializedGraphic,
} from '../types/pixi-serialize';
import { ViewportUI } from '../viewportUI';
import { TextArea } from '../model/template';
import { dragAttachedLines } from '../utils/dragAttachedLines';

export class TextContainer extends PluginContainer {
	protected readonly manager: ContainerManager;
	public readonly children: Array<TextArea>;
	public readonly uuid: string;
	public readonly typeId: ContainerTypeId;
	public linkedLinesUUID: Array<string> = [];
	public disabled: boolean;
	public textGraphic: TextArea;

	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;

	public cursor: CSSStyleProperty.Cursor;
	public isAttachedToFrame: boolean;
	public tabNumberContext: number;
	public frameNumber: number;
	public isEditing = false;
	private _viewport: ViewportUI
	private _isSelected = false;
	public isNew: boolean;

	static registerContainer(
		viewport: ViewportUI,
		attributes: Partial<SerializedContainer>,
		children: Array<ModelGraphics>,
		remote: boolean,
	) {
		return new TextContainer(viewport, attributes, children, remote);
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
		this.eventMode = properties.eventMode;
		this.disabled = properties.disabled;
		this.tabNumberContext = properties.tabNumberContext;
		this.isAttachedToFrame = properties.isAttachedToFrame;
		this.frameNumber = properties.frameNumber;
		this.absMinX = anchors.absMinX;
		this.absMinY = anchors.absMinY;
		this.absMaxX = anchors.absMaxX;
		this.absMaxY = anchors.absMaxY;
		this.manager = viewport.manager;
		this._viewport = viewport;
		this.on('pointerdown', this.onSelected);

		for (const element of children) {
			this.addChild(element);
			this.textGraphic = element as TextArea;
		}

		this.children[0].on('pointerdown', this.startEditing.bind(this));

		if (!remote) {
			const eventBoundary = new EventBoundary(this);
			const fakeEvent = new FederatedPointerEvent(eventBoundary);
			fakeEvent.global = this._viewport.mouse;
			fakeEvent.originalEvent = fakeEvent;
			fakeEvent.originalEvent.shiftKey = false;
			// isNew is a one time use.
			this.isNew = true;
			this.emit('pointerdown', fakeEvent);
			this.children[0].emit('pointerdown', fakeEvent);
		}
	}

	public startEditing() {
		if (!this.isEditing && this._isSelected) {
			this.isEditing = true;
			this.textGraphic.textSprite.visible = false;
			const { x, y, width, height, text, color } =  this.textGraphic;
			const fontSize = this.textGraphic.textStyle.fontSize;
			const padding = this.textGraphic.textStyle.padding;
			//@ts-ignore
			const containerized = this?.parent?.typeId === 'generic';
			this._viewport.startTextEditor(text, fontSize, color, x, y, width, height, padding, containerized);
		}
	}

	public endEditing() {
		this._isSelected = false;

		if (this.isEditing) {
			const size = {
				width: this._viewport.textEditor.offsetWidth,
				height: this._viewport.textEditor.offsetHeight
			};
			this.isEditing = false;
			this.textGraphic.textSprite.visible = true;

			const data = this._viewport.textEditor.innerHTML.replaceAll('</div>', '</div>,').split(',')
				.map((txt) => {
					if(txt === '<div><br></div>') {
						return "\n";
					} else {
						return txt.replace('<div>', '').replace('</div>', '').replace('<br>', '') + "\n"
					}
				}).join('');

			this.textGraphic.text = data.trim();
			this.textGraphic.updateText();
			this._viewport.endTextEditor();

			// This need to be canceled if the input text is empty, add a blocking condition.
			if(this.isNew) {
				this.isNew = false;
				if (this._viewport.socketPlugin) {
					this._viewport.socketPlugin.emit('ws-element-added', this.serializeData());
				}
			} else {
				if (this._viewport.socketPlugin) {
					this._viewport.socketPlugin.emit('ws-text-updated', this.uuid, this.serializeData());
					//@ts-ignore
					dragAttachedLines(this, this._viewport.socketPlugin, size);
				}
			}
		}
	}

	public destroy(options?: boolean | IDestroyOptions): void {
		this.children[0].destroy();
		super.destroy(options);
	}

	protected onSelected(e: FederatedPointerEvent) {
		if (e.forced || this.eventMode === 'none' || this.disabled) return;
		e.stopPropagation();
		this._isSelected = true;
		this.manager.selectContainer(this, e.originalEvent.shiftKey);
	}

	protected onChildrenChange(_length?: number): void {
		super.onChildrenChange(_length);
		if (!this.destroyed && this.children.length > 0) {
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
		return [this.children[0]] as unknown as Array<ModelGraphics>;
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
				eventMode: this.eventMode,
				tabNumberContext: this.tabNumberContext,
				isAttachedToFrame: this.isAttachedToFrame,
				frameNumber: this.frameNumber,
				disabled: this.disabled,
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

	public serializedColorimetry(): SerializedColorimetry {
		const graphic = this.getGraphicChildren()[0];
		const graphicSerialized = graphic.serializedColorimetry();

		return {
			uuid: this.uuid,
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

	public attachLine(lineUUID: string) {
		const index = this.linkedLinesUUID.findIndex((uuid) => uuid === lineUUID);
		if (index !== -1) return;
		this.linkedLinesUUID.push(lineUUID);
	}

	public detachLine(lineUUID: string) {
		const index = this.linkedLinesUUID.findIndex((uuid) => uuid === lineUUID);
		if (index === -1) return;
		this.linkedLinesUUID.splice(index, 1);
	}
}
