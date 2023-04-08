export interface HandleOptions {
	x: number;
	y: number;
	cursor: CSSStyleProperty.Cursor;
	handleId: number;
}

export interface HitAreaOptions {
	x: number;
	y: number;
	endX: number;
	endY: number;
	handleId: number;
	cursor: CSSStyleProperty.Cursor;
}