export type ContainerTypeId = 'generic' | 'frame';
export type GraphicTypeId = 'rectangle' | 'circle' | 'framebox';

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
