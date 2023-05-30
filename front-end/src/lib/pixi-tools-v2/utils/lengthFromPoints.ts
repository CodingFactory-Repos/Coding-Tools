import { ElementPosition } from '../types/pixi-container';

export const getLengthFromPoints = (pointA: ElementPosition, pointB: ElementPosition) => {
	const dx = pointB.x - pointA.x;
	const dy = pointB.y - pointA.y;
	return Math.sqrt(dx * dx + dy * dy) / 2;
};
