import { ModelGraphics } from '../../types/pixi-class';
import { GraphicAttributes } from '../../types/pixi-container-options';

export class Handle extends ModelGraphics {
	public readonly handleId: number;
	public readonly id: string;
	protected color: number;
	public radius: number;

	constructor(attr: GraphicAttributes, handleId: number) {
		super();

		const { color, cursor, alpha, radius } = attr;

		this.id = "handle";
		this.handleId = handleId;
		this.cursor = cursor ?? "default";
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.interactive = true;
		this.radius = radius;
		this.draw(attr);
	}

	public draw(attr: GraphicAttributes) {
		const { x, y, scale } = attr;
		const lineWidth = Math.max(0.05, 1 / scale);
		const rad = Math.max(0.25, this.radius * 1 / scale);
		this.position.set(x, y);
		this.visible = false;
		
		// TODO: need a secondary color in the options
		this.clear();
		this.lineStyle(lineWidth, 0x0c8ce9);
		this.beginFill(this.color);
		this.drawCircle(0, 0, rad);
		this.endFill();
	}
}
