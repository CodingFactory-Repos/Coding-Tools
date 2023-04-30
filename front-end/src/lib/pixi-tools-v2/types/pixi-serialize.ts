import { ElementBounds, ElementColorimetry, ElementCursor } from './pixi-container';

export type ContainerTypeId = 'generic' | 'frame';
export type GraphicTypeId = 'rectangle' | 'circle' | 'framebox';
export type InternalTypeId = 'border' | 'handle' | 'hitarea' | 'grid';

export interface SerializedElement {
	uuid: string;
	typeId: ContainerTypeId | GraphicTypeId | InternalTypeId;
}

export interface SerializedContainer extends SerializedElement {
	anchors: SerializedContainerAnchors;
	properties: SerializedContainerProperties;
	background?: Partial<SerializedGraphic>;
	childs: Array<Partial<SerializedContainer | SerializedGraphic>>;
}

export interface SerializedContainerBounds extends Partial<SerializedElement> {
	anchors: SerializedContainerAnchors;
	background?: SerializedGraphicBounds;
	childs: Array<SerializedContainerBounds | SerializedGraphicBounds>;
}

export interface SerializedGraphic extends SerializedElement {
	typeId: GraphicTypeId | InternalTypeId;
	bounds: ElementBounds;
	properties: SerializedGraphicProperties;
}

export interface SerializedGraphicBounds extends Partial<SerializedElement> {
	bounds: ElementBounds;
}

export interface SerializedContainerAnchors {
	absMinX: number;
	absMinY: number;
	absMaxX: number;
	absMaxY: number;
}

export interface SerializedProperties extends ElementCursor {
	interactive: boolean;
}

export interface SerializedContainerProperties extends SerializedProperties {
	isAttachedToFrame: boolean;
	tabNumberContext: number;
	frameNumber: number;
}

export interface SerializedGraphicProperties extends SerializedProperties, ElementColorimetry {
	rotation?: number;
}
