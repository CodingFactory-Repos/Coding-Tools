import { ElementBounds, ElementColorimetry, ElementCursor } from "./pixi-container";

export type ContainerTypeId = "generic" | "frame";
export type GraphicTypeId = "rectangle" | "circle";
export type InternalTypeId = "border" | "handle" | "hitarea" | "grid";

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

export interface SerializedGraphic extends SerializedElement {
	typeId: GraphicTypeId | InternalTypeId;
	bounds: ElementBounds;
	properties: SerializedGraphicProperties;
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