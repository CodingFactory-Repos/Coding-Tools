import { ModelGraphics } from '../../types/pixi-class';
import { GraphicAttributes } from '../../types/pixi-container-options';

export class Border extends ModelGraphics {
	public readonly id: string;
	protected color: number;

	constructor(attr: GraphicAttributes) {
		super();

		const { color, alpha, cursor } = attr;

		this.id = "border";
		this.cursor = cursor ?? "default";
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.draw(attr);
	}

	public draw(attr: GraphicAttributes) {
		const { x, y, width, height, scale } = attr;
		this.position.set(x, y);

		this.clear();
		this.lineStyle(2 / scale, this.color);
		this.drawRect(0, 0, width, height);
		this.endFill();
	}
}