import { EventMode, TextStyleAlign, TextStyleFontStyle, TextStyleFontWeight } from 'pixi.js';
import {
	AttachedContainer,
	ElementBounds,
	ElementColorimetry,
	ElementCursor,
	ElementPosition,
} from './pixi-container';

export type ContainerTypeId = 'generic' | 'frame' | 'line' | 'text' | 'wrap';
export type GraphicTypeId =
	| 'rectangle'
	| 'circle'
	| 'framebox'
	| 'triangle'
	| 'polygon'
	| 'bezier'
	| 'tree'
	| 'ellipse'
	| 'textarea'
	| 'stickyNote';

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

export interface SerializedControl extends Partial<SerializedElement> {
	anchors: SerializedContainerAnchors;
	background?: SerializedGraphicBounds;
	properties: SerializedLineProperties;
	childs: Array<SerializedContainerBounds | SerializedGraphicBounds>;
}

export interface SerializedContainerBounds extends Partial<SerializedElement> {
	anchors: SerializedContainerAnchors;
	background?: SerializedGraphicBounds;
	childs: Array<SerializedContainerBounds | SerializedGraphicBounds>;
}

export interface SerializedColorimetry extends Partial<SerializedElement> {
	background?: SerializedGraphicColorimetry;
	childs?: Array<SerializedColorimetry | SerializedGraphicColorimetry>;
}

export interface SerializedGraphicColorimetry extends SerializedElement {
	properties: Partial<SerializedGraphicProperties>;
}

export interface SerializedGraphic extends SerializedElement {
	lineControl?: SerializedLineGraphic;
	typeId: GraphicTypeId | InternalTypeId;
	bounds: Partial<ElementBounds>;
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
	eventMode: EventMode;
}

export interface SerializedLineProperties {
	startContainer: AttachedContainer;
	endContainer: AttachedContainer;
}

export interface SerializedContainerProperties
	extends SerializedProperties,
		Partial<SerializedLineProperties> {
	isAttachedToFrame: boolean;
	tabNumberContext: number;
	frameNumber?: number;
	disabled: boolean;
	isBlueprint?: boolean;
	typeBlueprint?: number;
}

export interface SerializedGraphicProperties extends SerializedProperties, ElementColorimetry, SerializedTextGraphic {
	rotation?: number;
	borderWidth?: number;
	borderColor?: number;
	arrowHead?: boolean;
	dashed?: boolean;
}

export interface SerializedTextGraphic {
	text?: string;
	fontSize?: string | number;
	fontWeight?: TextStyleFontWeight;
	fontStyle?: TextStyleFontStyle;
	fontFamily?: string | string[];
	fontPadding?: number;
	fontAlign?: TextStyleAlign;
	wordWrap?: boolean;
	wordWrapWidth?: number;
	breakWords?: boolean;
}

export interface SerializedLineGraphic {
	angleControl?: ElementPosition;
	startControl: ElementPosition;
	endControl: ElementPosition;
	start: ElementPosition;
	end: ElementPosition;
	lineWidth?: number;
}
