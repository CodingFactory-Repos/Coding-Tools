import { Viewport } from 'pixi-viewport';

import { Stage } from '@/lib/pixi-tools-v2/types/pixi-type-aliases';
import GeometryTemplate from '@/lib/pixi-tools-v2/model/template';
import { GeometryTypes, LiteralGeometryTypes } from './pixi-enums';
import { TypesRequired } from '@/interfaces/advanced-types.interface';
import { ContainerManager } from '../class/containerManager';

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
	color?: number,
	alpha?: number,
	rotation?: number,
	texture?: number,
	scale?: number,
}

export interface GraphicConstructor {
	Graphic: TypesRequired<typeof GeometryTemplate>;
	attributes: GraphicAttributes;
}

export interface ContainerContext {
	stage: Stage;
	viewport: Viewport;
	constructors: Array<GraphicConstructor>;
	manager?: ContainerManager;
}

export interface FrameContext {
	isAttached: boolean,
	to: number,
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

