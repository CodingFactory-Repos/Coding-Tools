import { Rectangle } from '../model/template';


// Enumerate the different types of shapes

export const GeometryTypes = {
	//TODO Mettre les objet à la place via constructeur - Thomas

	"RECTANGLE": Rectangle,
	"FRAME": Rectangle,
	//"CIRCLE": 'CIRCLE',
	// "ELLIPSE": 'ellipse',
	// "POLYGON":'polygon',
	// "POLYLINE": 'polyline',
	// "MULTIPOINT": 'multipoint',
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

export type GeometryTypes = typeof GeometryTypes;
export type LiteralGeometryTypes = keyof GeometryTypes;