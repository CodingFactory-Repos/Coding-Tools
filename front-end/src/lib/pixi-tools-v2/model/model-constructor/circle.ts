import { ModelGraphics } from '../../types/pixi-class';
import { GraphicAttributes } from '../../types/pixi-container';

export class Circle extends ModelGraphics {
	public readonly id: string;
	public color: number;
	public radius: number;

	constructor(attr: GraphicAttributes) {
		super();

		const { color, alpha, cursor } = attr;

		this.id = "graphic";
		this.cursor = cursor ?? "default";
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.interactive = true;
	}

	public draw(attr: GraphicAttributes) {
		const { x, y, radius } = attr;
		this.radius = radius;
		this.position.set(x, y);

		this.clear();
		this.beginFill(this.color);
		this.drawCircle(x, y, this.radius);
		this.endFill();
	}
}
