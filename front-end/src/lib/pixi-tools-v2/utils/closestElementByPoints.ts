import { Point } from 'pixi.js';
import { CanvasContainer } from '../types/pixi-aliases';
import { ElementBounds } from '../types/pixi-container';

interface ClosestElement {
	container: CanvasContainer;
	bounds: ElementBounds;
	distance: number;
}

export const getClosestElementByPoints = (
	container: Array<CanvasContainer>,
	scale: number,
	point: Point,
) => {
	let retrieved = false;
	const closestElement: Partial<ClosestElement> = {};

	for (let n = 0; n < container.length; n++) {
		const bounds = container[n].getGeometry();

		const distanceX = Math.max(bounds.x - point.x, 0, point.x - (bounds.x + bounds.width));
		const distanceY = Math.max(bounds.y - point.y, 0, point.y - (bounds.y + bounds.height));
		const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
		const threshold = 10 * scale;

		if (distance < threshold) {
			if (closestElement.distance !== undefined && distance > closestElement.distance) continue;

			closestElement.container = container[n];
			closestElement.distance = distance;
			closestElement.bounds = bounds;
			retrieved = true;
		}
	}

	return {
		retrieved,
		closestElement,
	};
};
