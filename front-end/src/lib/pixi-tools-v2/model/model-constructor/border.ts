import { Graphics } from "pixi.js";
import { GraphicAttributes } from "../../types/pixi-container-options";

export class Border extends Graphics {
	public id: string

	constructor(attr: GraphicAttributes) {
		super();

		const { x, y, width, height, scale } = attr;
		const lineWidth = Math.max(2 / scale, 0.5);

		this.id = "border";
		this.x = x;
		this.y = y;
		this.lineStyle(lineWidth, 0x0c8ce9, 2);
		this.moveTo(x, y);
		this.lineTo(x + width, y);
		this.lineTo(x + width, y + height);
		this.lineTo(x, y + height);
		this.lineTo(x, y - lineWidth / 2);
		this.endFill();
	}
}