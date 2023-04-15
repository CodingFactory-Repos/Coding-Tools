import { ViewportUI } from '../viewportUI';
import { ContainerManager } from '../class/containerManager';
import * as GeometryTemplate from '../model/template';

import { ModelGraphics } from './pixi-class';
import type { TypesRequired } from './pixi-utils-type';
import type { GeometryTypes } from './pixi-enums';
import type { Stage } from './pixi-aliases';

export interface GraphicAttributes {
	typeId?: string,
	x?: number,
	y?: number,
	width?: number,
	height?: number,
	radius?: number,
	color?: number,
	alpha?: number,
	rotation?: number,
	texture?: number,
	scale?: number,
	cursor?: CSSStyleProperty.Cursor,
	endX?: number,
	endY?: number,
	lineWidth?: number,
	left?: number,
	top?: number,
	right?: number,
	bottom?: number,
}

export interface GraphicConstructor {
	Graphic: TypesRequired<typeof GeometryTemplate>;
	attributes: GraphicAttributes;
}

export interface ContainerContext {
	stage: Stage;
	viewport: ViewportUI;
	constructors: GraphicConstructor | Array<GraphicConstructor>;
	manager?: ContainerManager;
	tabNumber?: number;
}

export interface FrameContext {
	tabFrameNumber?: number,
	isAttached: boolean,
	to: number,
}

export interface ContainerSize {
	width: number;
	height: number;
	absMinX: number;
	absMaxY: number;
	absMaxX: number;
	absMinY: number;
}

export interface ElementPosition {
	x: number;
	y: number;
}

export interface ElementSize {
	width?: number;
	height?: number;
	radius?: number;
}

export interface ElementBounds extends ElementPosition, ElementSize {}

export interface InitialResizeState extends ElementBounds {
	child: ModelGraphics;
}

export interface ProportionScaleOptions {
	parentInitialWidth: number,
	parentInitialHeight: number,
	parentPrimeWidth: number,
	parentPrimeHeight: number,
	anchorX: number,
	anchorY: number,
	childInitialX: number,
	childInitialY: number,
	childInitialWidth: number,
	childInitialHeight: number,
}


/** ----------------------------------------- */

/**
 * @deprecated suppport was removed
 */
export interface GeometryRequest {
	type : GeometryTypes,
}

/**
 * @deprecated suppport was removed
 */
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