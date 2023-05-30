import { Circle, LineBezier } from '../model/template';
import { ModelGraphics } from '../types/pixi-class';

export const modelBounds = (model: ModelGraphics) => {
	if (model instanceof Circle) {
		return {
			uuid: model.uuid,
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
				radius: model.radius,
			},
		};
	} else if (model instanceof LineBezier) {
		return {
			uuid: model.uuid,
			lineControl: {
				angleControl: model.angleControl,
				startControl: model.startControl,
				endControl: model.endControl,
				start: model.start,
				end: model.end,
			},
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
			},
		};
	} else {
		return {
			uuid: model.uuid,
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
			},
		};
	}
};
