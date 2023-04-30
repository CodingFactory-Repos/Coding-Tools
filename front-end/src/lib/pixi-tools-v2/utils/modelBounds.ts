import { ModelGraphics } from "../types/pixi-class";

export const modelBounds = (model: ModelGraphics) => ({
	uuid: model.uuid,
	bounds: {
		x: model.x,
		y: model.y,
		width: model.width,
		height: model.height,
	},
})