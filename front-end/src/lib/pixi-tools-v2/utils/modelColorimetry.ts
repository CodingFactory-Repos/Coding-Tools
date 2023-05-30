import { ModelGraphics } from '../types/pixi-class';
import { SerializedGraphicColorimetry } from '../types/pixi-serialize';

export const modelColorimetry = (model: ModelGraphics): SerializedGraphicColorimetry => {
	return {
		uuid: model.uuid,
		typeId: model.typeId,
		properties: {
			color: model.color,
			alpha: model.alpha,
		},
	};
};
