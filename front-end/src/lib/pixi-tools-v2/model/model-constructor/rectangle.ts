import { Graphics } from 'pixi.js';
import { GraphicAttributes } from '../../types/pixi-container-options';

export class Rectangle extends Graphics {
	public id: string;
	private _color: number;

	constructor(attr: GraphicAttributes) {
		super();

		this.id = "graphic";
		this.interactive = true;
		this.draw(attr);
	}

	public draw(attr: GraphicAttributes) {
		const { width, height, x, y, color } = attr;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		if(color !== undefined) this._color = color;
		if(this._color === 0) this.alpha = 0;
		this.beginFill(this._color);
		this.drawRect(x, y, width, height);
		this.endFill();
	}
}
