import { Point } from "pixi.js";
import { ElementPosition } from '../types/pixi-container';
import { isPointsOverlap } from "./pointsOverlap";

interface ClosestPoint<T> extends ElementPosition {
	id: T;
}

export const getClosestPointByPoints = <T> (points: Array<ClosestPoint<T>>, point: Point, overlapPoint: Point | ElementPosition) => {
	let minDistance = Infinity;
	let closestPoint: ClosestPoint<T>;

	for (const currentPoint of points) {
		const distance = Math.sqrt(Math.pow(point.x - currentPoint.x, 2) + Math.pow(point.y - currentPoint.y, 2));
		
		if (distance < minDistance && !isPointsOverlap(overlapPoint, currentPoint)) {
			minDistance = distance;
			closestPoint = currentPoint;
		}
	}
	
	return closestPoint;
}