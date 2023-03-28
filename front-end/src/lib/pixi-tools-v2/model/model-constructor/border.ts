import { Graphics } from "pixi.js";
import { GraphicAttributes } from "../../types/pixi-container-options";

export class Border extends Graphics {
	public id: string

	constructor(attr: GraphicAttributes) {
		super();

		const { x, y, width, height, scale } = attr;

		this.id = "border";
		this.x = x;
		this.y = y;
		this.lineStyle(1.5 / scale, 0x0c8ce9);
		this.drawRect(x, y, width, height);
		this.endFill();
	}
}