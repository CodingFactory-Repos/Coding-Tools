import { Viewport } from 'pixi-viewport';
import { ContainerContext, GeometryEvent, GraphicAttributes, GraphicConstructor } from '@/lib/pixi-tools-v2/types/pixi-container-options';
import { GeometryTypes } from '@/lib/pixi-tools-v2/types/pixi-enums'
import { Stage} from '@/lib/pixi-tools-v2/types/pixi-type-aliases';
import { Circle } from 'pixi.js';
import { Rectangle } from '@/lib/pixi-tools-v2/model/model-constructor/rectangle';
import { ViewportUI } from '../viewportUI';


export class Normalizer {
	protected readonly stage: Stage;
	protected readonly viewport: ViewportUI;

	constructor(stage: Stage, viewport: ViewportUI) {
		this.stage = stage;
		this.viewport = viewport;
	}

	public normalizeManyGraphic(event: GeometryEvent, attrs: Array<GraphicAttributes>): ContainerContext {
		const constructors: Array<GraphicConstructor> = [];

		for(let i = 0; i < attrs.length; i++) {
			const { Graphic, attributes } = this.normalizeProperties(event, attrs[i]);
			constructors.push({ Graphic, attributes });
		}

		return {
			stage: this.stage,
			viewport: this.viewport,
			constructors: constructors,
		}
	}

	public normalizeOneGraphic(event: GeometryEvent, isFrame: boolean): ContainerContext {
		let constructors: GraphicConstructor | Array<GraphicConstructor>;

		const { Graphic, attributes } = this.normalizeProperties(event);
		if(isFrame) constructors = [{ Graphic, attributes }];
		else constructors = { Graphic, attributes };

		if(isFrame) {
			// const t = {...attributes, x: 100, y: 100 };
			// constructors.push({ Graphic, attributes: t });
		}

		return {
			stage: this.stage,
			viewport: this.viewport,
			constructors: constructors,
		}
	}

	private normalizeProperties(props: GeometryEvent, attr: GraphicAttributes = {} as GraphicAttributes) {
		const Graphic = GeometryTypes[props.geometry];

		//! Calculate the center x,y of the graphic
		const originWidth = attr.width | 200; //TODO | Need to find a solution rather than hardcoded
		const originHeigh = attr.height | 200; //TODO | Need to find a solution rather than hardcoded
		const centerX = props.x - originWidth / 2;
		const centerY = props.y - originHeigh / 2;

		const attributes: GraphicAttributes = {
			x: centerX,
			y: centerY,
			color: attr.color | props.color,
			alpha: attr.alpha | 1,
			rotation: attr.rotation | 0,
			texture: attr.texture | 0,
		}

		if(typeof Graphic === typeof Rectangle) {
			attributes.width = originWidth;
			attributes.height = originHeigh;
		}

		if(typeof Graphic === typeof Circle) {
			attributes.radius = attr.radius | 0;
		}

		return {
			Graphic,
			attributes,
		}
	}
}

// import { Viewport } from 'pixi-viewport';
// import * as PIXI from 'pixi.js';
// import { Scene } from '../scene';
// import { GeometryRequest, NormalizedObject } from '@/lib/pixi-tools-v2/types/pixi-container-options';
// import { GeometryTypes } from '@/lib/pixi-tools-v2/types/pixi-enums'
// import { Stage} from '@/lib/pixi-tools-v2/types/pixi-type-aliases';


// export class Normalizer {
//     /**
//      * The stage to which this PixiObject belongs.
//      * @private
//      */
//     private readonly _stage: Stage;

//     /**
//      * The viewport to which this PixiObject belongs.
//      * @private
//      */
//     private readonly _viewport: Viewport;

//     constructor(stage: Stage, viewport: Viewport) {
//         this._stage = stage;
//         this._viewport = viewport;
//     }

//     watchdogGraphics(object: NormalizedObject[]): { scene: Stage, viewport: Viewport, Geometry: NormalizedObject } {

//         const normalizedObj: NormalizedObject[] = [];

//         for (let i = 0; i < object.length; i++) {
//             const obj = object[i];
//             normalizedObj[i] = this.normalizeObject(obj);
//             switch (obj.graphic.toString()) {
//                 case "RECTANGLE":
//                     normalizedObj[i].graphic = obj.graphic;
//                     break;
//                 case "ELLIPSE":
//                     normalizedObj[i].graphic = obj.graphic;
//                     break;
//                 case "CIRCLE":
//                     normalizedObj[i].graphic = obj.graphic;
//                     break
//                 case "POLYGON":
//                     normalizedObj[i].graphic = obj.graphic;
//                     break;
//                 case "POLYLINE":
//                     normalizedObj[i].graphic = obj.graphic;
//                     break;
//                 case "TEXTINPUT":
//                     normalizedObj[i].graphic = obj.graphic;
//                     break;
//                 default:
//                     throw new Error("Unknown Object Type : " + normalizedObj[i].constructor);
//             }
//         }
//         return {
//             scene: this._stage,
//             viewport: this._viewport,
//             Geometry: normalizedObj
//         }
//     }

//     private normalizeObject(object: NormalizedObject) {
//         const type = object.graphic;
//         //TODO Faire un initialisateur d'objet NormalizedObject
//         let obj = {
//             graphic: GeometryTypes[type.toString()],
//             x: 0.0,
//             y: 0,
//             width: 0,
//             height: 0,
//             color: 0,
//             alpha: 0,
//             rotation: 0,
//             scaleX: 0, //TODO System of Scaling, Christopher need to change it 
//             scaleY: 0, //TODO System of Scaling, Christopher need to change it 
//             scaleZ: 0, //TODO System of Scaling, Christopher need to change it 
//             texture: 0 // If u want to use texture
//         }
//         object = obj;
//         return object;
//     }
// }