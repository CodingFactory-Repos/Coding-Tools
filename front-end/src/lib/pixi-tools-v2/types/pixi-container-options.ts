import { Viewport } from 'pixi-viewport';
import { Circle } from 'pixi.js';

import { Stage } from '@/lib/pixi-tools-v2/types/pixi-type-aliases';
import { Rectangle } from '../model/model-constructor/rectangle';
import { GeometryTypes, LiteralGeometryTypes } from './pixi-enums';

export interface GeometryRequest {
	type : GeometryTypes,
}


export interface GeometryEvent {
	geometry: LiteralGeometryTypes;
	clientX: number;
	clientY: number;
	color?: number;
}

export interface GraphicAttributes {
	x: number,
	y: number,
	width?: number,
	height?: number,
	radius?: number,
	color: number,
	alpha: number,
	rotation: number,
	texture: number,
}

export interface GraphicConstructor {
	Graphic: typeof Rectangle /* | Circle*/;
	attributes: GraphicAttributes;
}

export interface ContainerContext {
	stage: Stage;
	viewport: Viewport;
	constructors: Array<GraphicConstructor>;
}

export interface NormalizedObject {
    graphic: GeometryRequest["type"],
    x:number,
    y:number,
    width:number,
    height:number,
    color:number,
    alpha:number,
    rotation:number,
    scaleX:number, //TODO System of Scaling, Christopher need to change it 
    scaleY:number, //TODO System of Scaling, Christopher need to change it 
    scaleZ:number, //TODO System of Scaling, Christopher need to change it 
    texture:number // If u want to use texture
  }

