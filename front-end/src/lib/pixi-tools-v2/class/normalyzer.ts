import { Rectangle } from '../model/template';
import { ViewportUI } from '../viewportUI';

import { ContainerType, GeometryTypes, LiteralGeometryTypes } from '../types/pixi-enums'
import type { ElementPosition } from '../types/pixi-container';
import { ContainerTypeId, GraphicTypeId, SerializedContainer, SerializedGraphic } from '../types/pixi-serialize';
import { generateUniqueId } from '../utils/uniqueId';
import { GenericContainer } from './genericContainer';
import { FramedContainer } from './framedContainer';

export interface GeometryEvent {
	x: number;
	y: number;
	geometry: LiteralGeometryTypes;
	color?: number;
}

export class Normalizer {
	static graphic(
		data: Partial<SerializedGraphic>,
		position?: ElementPosition
	) {
		const Graphic = GeometryTypes[data.typeId as GraphicTypeId];
		const attributes = data as SerializedGraphic;
		
		if(!attributes.bounds && position) {
			const width = 200; //TODO | Need to find a solution rather than hardcoded
			const height = 200; //TODO | Need to find a solution rather than hardcoded

			attributes.bounds = {
				x: position.x - width / 2,
				y: position.y - height / 2,
				width,
				height,
			}
		}

		if(!attributes.properties) {
			attributes.properties = {
				color: 0xffffff,
				cursor: "pointer",
				interactive: true,
				alpha: 1,
			}
		}

		attributes.uuid = attributes.uuid ?? generateUniqueId();
		return Graphic.registerGraphic(attributes);
	}

	static container(
		viewport: ViewportUI,
		data: Partial<SerializedContainer>,
		remote = false,
		position?: ElementPosition,
		tabContext?: number
	) {
		const { childs, background, ...attr } = data;
		const Container = ContainerType[attr.typeId as ContainerTypeId];

		let backgroundChildren: Rectangle;
		const attributes = attr;
		const children = [];

		if(background) {
			backgroundChildren = this.graphic(background, position);
		}

		if(!attributes.anchors) {
			attributes.anchors = {
				absMinX: 0,
				absMinY: 0,
				absMaxX: 0,
				absMaxY: 0,
			}
		}

		if(!attributes.properties) {
			const allFrames = viewport.children.filter(child => child.typeId === "frame");
			const frameNumbers = allFrames.map((frame) => frame.frameNumber);
			const frameNumber = [...new Set(frameNumbers)].reduce((acc, cur) => cur === acc ? acc + 1 : cur > acc ? acc : cur, 1);

			attributes.properties = {
				cursor: "pointer",
				frameNumber,
				interactive: true,
				isAttachedToFrame: false,
				tabNumberContext: tabContext,
			}
		}

		for(let n = 0; n < childs?.length; n++) {
			const childTypeId = childs[n].typeId;

			if(childTypeId === "generic" || childTypeId === "frame") {
				const containerChildren = this.container(viewport, childs[n] as SerializedContainer, remote, position, tabContext);
				children.push(containerChildren);
			} else {
				const graphicChildren = this.graphic(childs[n] as SerializedGraphic, position);
				children.push(graphicChildren);
			}
		}

		attributes.uuid = attributes.uuid ?? generateUniqueId();
		if(Container === GenericContainer) return Container.registerContainer(viewport, attributes, children, remote);
		if(Container === FramedContainer)  return Container.registerContainer(viewport, attributes, children, remote, backgroundChildren);
	}
}

/** //! Everything below is deprecated */

//! Below was the second version

// public normalizeManyGraphic(event: GeometryEvent, attrs: Array<GraphicAttributes>): ContainerContext {
	// 	const constructors: Array<GraphicConstructor> = [];

	// 	for(let i = 0; i < attrs.length; i++) {
	// 		const { Graphic, attributes } = this.normalizeProperties(event, attrs[i]);
	// 		constructors.push({ Graphic, attributes });
	// 	}

	// 	return {
	// 		stage: this.stage,
	// 		viewport: this.viewport,
	// 		constructors: constructors,
	// 	}
	// }

	// public normalizeOneGraphic(event: GeometryEvent, isFrame: boolean): ContainerContext {
	// 	let constructors: GraphicConstructor | Array<GraphicConstructor>;

	// 	const { Graphic, attributes } = this.normalizeProperties(event);
	// 	if(isFrame) constructors = [{ Graphic, attributes }];
	// 	else constructors = { Graphic, attributes };

	// 	if(isFrame) {
	// 		// const t = {...attributes, x: 100, y: 100 };
	// 		// constructors.push({ Graphic, attributes: t });
	// 	}

	// 	return {
	// 		stage: this.stage,
	// 		viewport: this.viewport,
	// 		constructors: constructors,
	// 	}
	// }

	// private normalizeProperties(props: GeometryEvent, attr: GraphicAttributes = {} as GraphicAttributes) {
	// 	const Graphic = GeometryTypes[props.geometry];

	// 	//! Calculate the center x,y of the graphic
	// 	const originWidth = attr.width | 200; //TODO | Need to find a solution rather than hardcoded
	// 	const originHeigh = attr.height | 200; //TODO | Need to find a solution rather than hardcoded
	// 	const centerX = props.x - originWidth / 2;
	// 	const centerY = props.y - originHeigh / 2;

	// 	const attributes: GraphicAttributes = {
	// 		x: centerX,
	// 		y: centerY,
	// 		color: attr.color | props.color,
	// 		alpha: attr.alpha | 1,
	// 		rotation: attr.rotation | 0,
	// 		texture: attr.texture | 0,
	// 	}

	// 	if(typeof Graphic === typeof Rectangle) {
	// 		attributes.width = originWidth;
	// 		attributes.height = originHeigh;
	// 	}

	// 	if(typeof Graphic === typeof Circle) {
	// 		attributes.radius = attr.radius | 0;
	// 	}

	// 	return {
	// 		Graphic,
	// 		attributes,
	// 	}
	// }

//! Below was the first version

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