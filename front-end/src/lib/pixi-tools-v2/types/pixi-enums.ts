import GeometryTemplate from '@/lib/pixi-tools-v2/model/template';


// Enumerate the different types of shapes

export const GeometryTypes = {
	//TODO Mettre les objet à la place via constructeur - Thomas

	"RECTANGLE": GeometryTemplate.Rectangle,
	//"CIRCLE": 'CIRCLE',
	// "ELLIPSE": 'ellipse',
	// "POLYGON":'polygon',
	// "POLYLINE": 'polyline',
	// "MULTIPOINT": 'multipoint',
} as const;


export type GeometryTypes = typeof GeometryTypes;
export type LiteralGeometryTypes = keyof GeometryTypes;