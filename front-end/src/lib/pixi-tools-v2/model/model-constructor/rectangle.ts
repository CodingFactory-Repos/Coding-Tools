import { ModelGraphics } from '../../types/pixi-class';
import { GraphicAttributes } from '../../types/pixi-container';

export class Rectangle extends ModelGraphics {
	public readonly id: string;
	public color: number;

	constructor(attr: GraphicAttributes) {
		super();

		const { color, cursor, alpha, id } = attr;

		this.id = id ?? "graphic";
		this.cursor = cursor ?? "default";
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.interactive = true;
		this.draw(attr);
	}

	public draw(attr: GraphicAttributes) {
		const { width, height, x, y } = attr;
		this.position.set(x, y);
		this.height = height;
		this.width = width;

		this.clear();
		this.beginFill(this.color);
		this.drawRect(0, 0, width, height);
		this.endFill();
	}
}
