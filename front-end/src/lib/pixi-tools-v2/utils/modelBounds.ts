import { Circle, LineBezier, TextArea } from '../model/template';
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
				lineWidth: model.lineWidth,
			},
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
			},
		};
	} else if (model instanceof TextArea) {
		return {
			uuid: model.uuid,
			properties: {
				fontSize: model.textStyle.fontSize,
				fontPadding: model.textStyle.padding,
			},
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
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
		};
	}
};
