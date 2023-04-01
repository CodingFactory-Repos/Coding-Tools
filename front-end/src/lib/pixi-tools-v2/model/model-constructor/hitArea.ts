import { ModelGraphics } from "../../types/pixi-class";
import { GraphicAttributes } from "../../types/pixi-container-options";

export class HitArea extends ModelGraphics {
	public readonly handleId: number;
	public readonly id: string;
	protected color: number;

	constructor(attr: GraphicAttributes, handleId: number) {
		super();

		const { color, cursor, alpha } = attr;

		this.id = "line";
		this.handleId = handleId;
		this.cursor = cursor ?? "default";
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.interactive = true;
		this.draw(attr);
	}

	public draw(attr: GraphicAttributes) {
		const { x, y, endX, endY, lineWidth } = attr;

		this.clear();
		this.lineStyle(lineWidth, this.color);
		this.moveTo(x, y);
		this.lineTo(endX, endY);
		this.hitArea = this.getBounds();
	}
}