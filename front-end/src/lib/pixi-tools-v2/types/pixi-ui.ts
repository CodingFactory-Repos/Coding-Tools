import {
	ElementColorimetry,
	ElementCursor,
	ElementDimension,
	ElementPosition,
} from './pixi-container';

export interface MaxElementPosition {
	endX: number;
	endY: number;
}

export interface GraphicUIProperties
	extends ElementPosition,
		ElementDimension,
		ElementCursor,
		ElementColorimetry,
		MaxElementPosition {
	lineWidth?: number;
	scale?: number;
	left?: number;
	top?: number;
}

export interface HandleOptions extends ElementPosition, ElementCursor {
	handleId: number;
}

export interface HitAreaOptions extends HandleOptions, MaxElementPosition {}
