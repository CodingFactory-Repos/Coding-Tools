import { ElementPosition } from "../types/pixi-container";

export const isPointsOverlap = (pointA: ElementPosition, pointB: ElementPosition) => {
	return pointA.x === pointB.x && pointA.y === pointB.y;
}