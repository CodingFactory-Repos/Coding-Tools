import { Graphics } from 'pixi.js';
import { GraphicAttributes } from '../../types/pixi-container-options';

export class Rectangle extends Graphics {
	public id: string;
	private _color: number;

	constructor(attr: GraphicAttributes) {
		super();

		const { width, height, x, y, color } = attr;

		this.id = "graphic";
		this._color = color;
		this.interactive = true;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		if(this._color === 0) this.alpha = 0;
		this.beginFill(this._color);
		this.drawRect(x, y, width, height);
		this.endFill();
	}
}
