import { FramedContainer } from '../class/framedContainer';
import { GenericContainer } from '../class/genericContainer';
import { LineContainer } from '../class/lineContainer';
import { Circle, Rectangle, Triangle, LineBezier } from '../model/template';

export const GeometryTypes = {
	//TODO Mettre les objet à la place via constructeur - Thomas

	rectangle: Rectangle,
	circle: Circle,
	framebox: Rectangle,
	triangle: Triangle,
	bezier: LineBezier,

	//! BROKEN DON'T USE
	//polygon: Polygon, // Bugged

	// "ELLIPSE": 'ellipse',
	// "POLYLINE": 'polyline',
	// "MULTIPOINT": 'multipoint',
} as const;

export const ContainerType = {
	generic: GenericContainer,
	frame: FramedContainer,
	line: LineContainer,
} as const;

export enum ResizeHandle {
	LT = 0, // LeftTop
	RT = 1, // RightTop
	RB = 2, // RightBottom
	LB = 3, // LeftBottom
	T = 4, // Top
	R = 5, // Right
	B = 6, // Bottom
	L = 7, // Left
}

export enum BezierHandle {
	T = 0,
	R = 1,
	B = 2,
	L = 3,
}

export enum BezierCurveHandle {
	P1 = 0,
	P2 = 1,
}

export const ResizeHandleOppositeOf = {
	[ResizeHandle.LT]: { x: ResizeHandle.RT, y: ResizeHandle.LB },
	[ResizeHandle.RT]: { x: ResizeHandle.LT, y: ResizeHandle.RB },
	[ResizeHandle.RB]: { x: ResizeHandle.LB, y: ResizeHandle.RT },
	[ResizeHandle.LB]: { x: ResizeHandle.RB, y: ResizeHandle.LT },
	[ResizeHandle.T]: { x: null, y: ResizeHandle.B },
	[ResizeHandle.B]: { x: null, y: ResizeHandle.T },
	[ResizeHandle.R]: { x: ResizeHandle.L, y: null },
	[ResizeHandle.L]: { x: ResizeHandle.R, y: null },
};

export const LeftWall = [ResizeHandle.RT, ResizeHandle.RB, ResizeHandle.R];
export const RightWall = [ResizeHandle.LT, ResizeHandle.LB, ResizeHandle.L];
export const TopWall = [ResizeHandle.LB, ResizeHandle.RB, ResizeHandle.B];
export const BottomWall = [ResizeHandle.LT, ResizeHandle.RT, ResizeHandle.T];

export enum DownloadType {
	MIME_PNG = 'image/png',
	MIME_JPG = 'image/jpeg',
	MIME_WEBP = 'image/webp',
	MIME_PDF = 'application/pdf',
}

export type GeometryTypes = typeof GeometryTypes;
export type LiteralGeometryTypes = keyof GeometryTypes;
export type ContainerType = typeof ContainerType;

export enum PixiEventMode {
	NONE = 'none',
	PASSIVE = 'passive',
	AUTO = 'auto',
	STATIC = 'static',
	DYNAMIC = 'dynamic',
}
