import { Circle } from '../model/template';
import { ModelGraphics } from '../types/pixi-class';

export const modelSerializer = (model: ModelGraphics) => {
	if(model instanceof Circle) {
		return {
			uuid: model.uuid,
			typeId: model.typeId,
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
				radius: model.radius,
			},
			properties: {
				cursor: model.cursor,
				interactive: model.interactive,
				color: model.color,
				alpha: model.alpha,
			},
		}
	} else {
		return {
			uuid: model.uuid,
			typeId: model.typeId,
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
			},
			properties: {
				cursor: model.cursor,
				interactive: model.interactive,
				color: model.color,
				alpha: model.alpha,
			},
		}
	}
};
