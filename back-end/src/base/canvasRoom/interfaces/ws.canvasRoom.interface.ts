export type ContainerTypeId = 'generic' | 'frame';
export type GraphicTypeId = 'rectangle' | 'circle' | 'framebox';

export enum BezierHandle {
	T = 0,
	R = 1,
	B = 2,
	L = 3,
}

export interface ElementPosition {
	x: number;
	y: number;
}

export interface ElementSize {
	width: number;
	height: number;
}

export interface ElementRadius {
	radius: number;
}

export interface ElementDimension extends ElementSize, ElementRadius {}
export interface ElementBounds extends ElementPosition, Partial<ElementDimension> {}

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

export interface SerializedContainerBounds extends Partial<SerializedElement> {
	lineControl?: SerializedLineGraphic;
	anchors: SerializedContainerAnchors;
	background?: Partial<SerializedGraphicBounds>;
	childs: Array<Partial<SerializedContainerBounds | SerializedGraphicBounds>>;
}

export interface SerializedGraphicBounds extends Partial<SerializedElement> {
	bounds: ElementBounds;
}

export interface SerializedGraphic extends SerializedElement {
	typeId: GraphicTypeId;
	bounds: ElementBounds;
	properties: SerializedGraphicProperties;
}

export interface SerializedControl extends Partial<SerializedElement> {
	anchors: SerializedContainerAnchors;
	background?: SerializedGraphicBounds;
	properties: SerializedLineProperties;
	childs: Array<SerializedContainerBounds | SerializedGraphicBounds>;
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

export interface SerializedLineProperties {
	startContainer: AttachedContainer;
	endContainer: AttachedContainer;
}

export interface AttachedContainer {
	containerUUID: string;
	handleId: BezierHandle;
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

export interface SerializedLineGraphic {
	angleControl?: ElementPosition;
	startControl: ElementPosition;
	endControl: ElementPosition;
	start: ElementPosition;
	end: ElementPosition;
}