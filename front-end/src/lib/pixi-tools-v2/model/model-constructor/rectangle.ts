import { Graphics } from 'pixi.js';
import { GraphicAttributes } from '../../types/pixi-container-options';

export class Rectangle extends Graphics {
	private _color: number;

	constructor(attr: GraphicAttributes) {
		super();

		const { width, height, x, y, color } = attr;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this._color = color;
		this.beginFill(this._color);
		this.drawRect(x, y, width, height);
		this.endFill();
	}
}
