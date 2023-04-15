import { ObjectId } from 'mongodb';

export interface CanvasRoom {
	_id?: ObjectId;
	title: string;
	owner: ObjectId;
	allowedPeers: Array<ObjectId>;
	createdAt: Date;
	lastUpdatedAt: Date;
	canvas: any;
}

export type ContainerTypeId = "generic" | "frame";
export type GraphicTypeId = "rectangle" | "circle";

export interface ElementBounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface SerializedElement {
	uuid: string;
	typeId: ContainerTypeId | GraphicTypeId;
}

export interface SerializedContainer extends SerializedElement {
	anchors: SerializedContainerAnchors;
	properties: SerializedContainerProperties;
	background?: Partial<SerializedGraphic>;
	childs: Array<Partial<SerializedContainer | SerializedGraphic>>;
}

export interface SerializedGraphic extends SerializedElement {
	typeId: GraphicTypeId;
	bounds: ElementBounds;
	properties: SerializedGraphicProperties;
}

export interface SerializedContainerAnchors {
	absMinX: number;
	absMinY: number;
	absMaxX: number;
	absMaxY: number;
}

export interface SerializedProperties {
	cursor: string;
	interactive: boolean;
}

export interface SerializedContainerProperties extends SerializedProperties {
	isAttachedToFrame: boolean;
	tabNumberContext: number;
	frameNumber: number;
}

export interface SerializedGraphicProperties extends SerializedProperties {
	color: number;
	alpha: number;
}