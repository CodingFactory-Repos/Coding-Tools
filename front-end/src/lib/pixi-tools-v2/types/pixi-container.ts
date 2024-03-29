import { ModelGraphics } from './pixi-class';
import { BezierHandle } from './pixi-enums';
import { SerializedContainerAnchors, SerializedLineGraphic, SerializedTextGraphic } from './pixi-serialize';

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

export interface ElementCursor {
	cursor: CSSStyleProperty.Cursor;
}

export interface ElementColorimetry {
	color: number;
	alpha: number;
}

export interface ElementDimension extends ElementSize, ElementRadius {}
export interface ElementBounds extends ElementPosition, Partial<ElementDimension> {}
export interface ContainerSize extends ElementSize, SerializedContainerAnchors {}

export interface InitialGraphicState extends ElementBounds, Partial<SerializedLineGraphic>, Partial<SerializedTextGraphic> {
	child: ModelGraphics;
}

export interface InitialGraphicLineState
	extends InitialGraphicState,
		Partial<SerializedLineGraphic> {}

export interface InitialGraphicTextState
	extends InitialGraphicState,
		Partial<SerializedTextGraphic> {}

export interface AttachedContainer {
	containerUUID: string;
	handleId: BezierHandle;
}
