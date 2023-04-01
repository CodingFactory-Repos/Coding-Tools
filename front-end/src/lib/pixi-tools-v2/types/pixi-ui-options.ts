export interface HandleOptions {
	x: number;
	y: number;
	cursor: CSStyleProperty.Cursor;
	handleId: number;
}

export interface HitAreaOptions {
	x: number;
	y: number;
	endX: number;
	endY: number;
	lineWidth: number;
	handleId: number;
	cursor: CSStyleProperty.Cursor;
}