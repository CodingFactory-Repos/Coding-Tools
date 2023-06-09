import { Circle, LineBezier, TextArea } from '../model/template';
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
				arrowHead: model.arrowHead,
				dashed: model.dashed,
			},
		};
	} else {
		const properties: SerializedGraphicProperties = {
			cursor: model.cursor,
			eventMode: model.eventMode,
			color: model.color,
			alpha: model.alpha,
		};

		if (model.borderWidth !== undefined) properties.borderWidth = model.borderWidth;
		if (model.borderColor !== undefined) properties.borderColor = model.borderColor;
		if (model instanceof TextArea) {
			properties.text = model.text;
			properties.fontSize = model.textStyle.fontSize;
			properties.fontStyle = model.textStyle.fontStyle;
			properties.fontWeight = model.textStyle.fontWeight;
			properties.fontFamily = model.textStyle.fontFamily;
			properties.fontPadding = model.textStyle.padding;
			properties.fontAlign = model.textStyle.align;
			properties.wordWrap = model.textStyle.wordWrap;
			properties.wordWrapWidth = model.textStyle.wordWrapWidth;
			properties.breakWords = model.textStyle.breakWords;
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
