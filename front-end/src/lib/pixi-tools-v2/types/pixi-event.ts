import { LiteralGeometryTypes } from "./pixi-enums";

export interface GeometryEvent {
	x: number;
	y: number;
	geometry: LiteralGeometryTypes;
	color?: number;
}