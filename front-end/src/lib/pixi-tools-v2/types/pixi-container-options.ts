import { Viewport } from 'pixi-viewport';

import { Stage } from '@/lib/pixi-tools-v2/types/pixi-type-aliases';
import GeometryTemplate from '@/lib/pixi-tools-v2/model/template';
import { GeometryTypes, LiteralGeometryTypes } from './pixi-enums';
import { TypesRequired } from '@/interfaces/advanced-types.interface';
import { ContainerManager } from '../class/containerManager';
import { FramedContainer } from '../class/framedContainer';
import { GenericContainer } from '../class/genericContainer';
import { WrappedContainer } from '../class/wrappedContainer';
import { ViewportUI } from '../viewportUI';
import { Graphics } from 'pixi.js';

export interface GeometryRequest {
	type : GeometryTypes,
}

export type CanvasContainer = FramedContainer | GenericContainer;
export type PluginContainer = CanvasContainer | WrappedContainer;

export interface GeometryEvent {
	x: number;
	y: number;
	geometry: LiteralGeometryTypes;
	color?: number;
}

export interface GraphicAttributes {
	id?: string,
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
	cursor?: CSStyleProperty.Cursor,
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

export interface InitialResizeState {
	child: Graphics;
	width: number;
	height: number;
	x: number;
	y: number;
}

export interface ContainerSize {
	width: number;
	height: number;
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