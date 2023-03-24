import { Graphics } from 'pixi.js';
import { GraphicAttributes } from '../../types/pixi-container-options';

export class Circle extends Graphics {
	private _color: number;
	private _radius: number;

	constructor(attr: GraphicAttributes) {
		super();

		const { x, y, color, radius } = attr;

		this.x = x;
		this.y = y;
		this._radius = radius;
		this._color = color;
		this.beginFill(this._color);
		this.drawCircle(x, y, radius);
		this.endFill();
	}
}
