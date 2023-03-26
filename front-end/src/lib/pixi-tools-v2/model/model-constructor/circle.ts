import { Graphics } from 'pixi.js';
import { GraphicAttributes } from '../../types/pixi-container-options';

export class Circle extends Graphics {
	public id: string;
	private _color: number;
	private _radius: number;

	constructor(attr: GraphicAttributes) {
		super();

		const { x, y, color, radius } = attr;

		this.id = "graphic";
		this._color = color;
		this._radius = radius;
		this.interactive = true;

		this.x = x;
		this.y = y;
		this.beginFill(this._color);
		this.drawCircle(x, y, radius);
		this.endFill();
	}

	public get radius(): number {
		return this._radius;
	}
}
