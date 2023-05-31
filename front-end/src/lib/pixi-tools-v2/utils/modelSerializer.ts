import { Circle, LineBezier } from '../model/template';
import { ModelGraphics } from '../types/pixi-class';
import { SerializedGraphicProperties } from '../types/pixi-serialize';

export const modelSerializer = (model: ModelGraphics) => {
	if (model instanceof Circle) {
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
				eventMode: model.eventMode,
				color: model.color,
				alpha: model.alpha,
				borderWidth: model.borderWidth,
				borderColor: model.borderColor,
			},
		};
	} else if (model instanceof LineBezier) {
		return {
			uuid: model.uuid,
			typeId: model.typeId,
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
			properties: {
				cursor: model.cursor,
				eventMode: model.eventMode,
				color: model.color,
				alpha: model.alpha,
			},
		};
	} else {
		const properties: SerializedGraphicProperties = {
			cursor: model.cursor,
			eventMode: model.eventMode,
			color: model.color,
			alpha: model.alpha,
		};

		if (model.borderWidth !== undefined && model.borderColor !== undefined) {
			properties.borderWidth = model.borderWidth;
			properties.borderColor = model.borderColor;
		}

		return {
			uuid: model.uuid,
			typeId: model.typeId,
			bounds: {
				x: model.x,
				y: model.y,
				width: model.width,
				height: model.height,
			},
			properties: properties,
		};
	}
};
