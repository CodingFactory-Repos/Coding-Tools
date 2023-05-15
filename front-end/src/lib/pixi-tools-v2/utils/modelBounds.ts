import { Circle } from '../model/template';
import { ModelGraphics } from '../types/pixi-class';

export const modelBounds = (model: ModelGraphics) => {
	if(model instanceof Circle) {
		return {
			uuid: model.uuid,
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
				radius: model.radius
			},
		}
	} else {
		return {
			uuid: model.uuid,
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
			},
		}
	}
};
