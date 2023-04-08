import { ModelGraphics } from "../../types/pixi-class";
import { GraphicAttributes } from "../../types/pixi-container";

export class HitArea extends ModelGraphics {
	public readonly id: string;
	public handleId: number;
	protected color: number;
	public lineWidth: number;

	constructor(attr: GraphicAttributes) {
		super();

		const { color, cursor, alpha, lineWidth } = attr;

		this.id = "line";
		this.cursor = cursor ?? "default";
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.lineWidth = lineWidth ?? 5;
		this.interactive = true;
		this.draw(attr);
	}

	public draw(attr: GraphicAttributes) {
		const { x, y, endX, endY, scale } = attr;
		const lineWidth = Math.min(80, Math.max(0.4, this.lineWidth / scale));

		this.clear();
		this.lineStyle(lineWidth, 0xff00ff);
		this.moveTo(x, y);
		this.lineTo(endX, endY);
		this.hitArea = this.getLocalBounds();
	}
}