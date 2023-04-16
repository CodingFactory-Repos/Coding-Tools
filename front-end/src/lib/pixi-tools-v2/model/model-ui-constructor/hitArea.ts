import { ModelGraphics } from '../../types/pixi-class';
import { GraphicUIProperties } from '../../types/pixi-ui';
import { InternalTypeId } from '../../types/pixi-serialize';

export class HitArea extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: InternalTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public lineWidth: number;
	public handleId: number;
	public color: number;

	constructor(attr: Partial<GraphicUIProperties>) {
		super();

		const { color, cursor, alpha, lineWidth } = attr;

		this.typeId = 'hitarea';
		this.cursor = cursor ?? 'default';
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.lineWidth = lineWidth ?? 5;
		this.interactive = true;
		this.draw(attr);
	}

	public draw(attr: Partial<GraphicUIProperties>) {
		const { x, y, endX, endY, scale } = attr;
		const lineWidth = Math.min(80, Math.max(0.4, this.lineWidth / scale));

		this.clear();
		this.position.set(x, y);
		this.lineStyle(lineWidth, 0xff00ff);
		this.moveTo(0, 0);
		this.lineTo(endX - x, endY - y);
		this.hitArea = this.getLocalBounds();
	}

	public serialized() {
		return {
			uuid: this.uuid,
			typeId: this.typeId,
			bounds: {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
			},
			properties: {
				cursor: this.cursor,
				interactive: this.interactive,
				color: this.color,
				alpha: this.alpha,
			},
		};
	}
}
