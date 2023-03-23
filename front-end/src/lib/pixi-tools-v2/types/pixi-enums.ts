import * as GeometryTemplate from '@/lib/pixi-tools-v2/model/model-constructor/rectangle'


// Enumerate the different types of shapes

export const GeometryTypes = {
	//TODO Mettre les objet à la place via constructeur - Thomas

	"RECTANGLE": new GeometryTemplate.Rectangle(0,0,0,0,0)
	//"CIRCLE": 'CIRCLE',
	// "Ellipse": 'ellipse',
	// "Polygon":'polygon',
	// "Polyline": 'polyline',
	// "MultiPoint": 'multipoint',
} as const;


export type GeometryTypes = typeof GeometryTypes;