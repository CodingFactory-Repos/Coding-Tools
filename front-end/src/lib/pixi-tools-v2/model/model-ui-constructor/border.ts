import { ModelGraphics } from '../../types/pixi-class';
import { GraphicUIProperties } from '../../types/pixi-ui';
import { InternalTypeId } from '../../types/pixi-serialize';
import { modelSerializer } from '../../utils/modelSerializer';
import { modelBounds } from '../../utils/modelBounds';

export class Border extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: InternalTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public color: number;

	constructor(attr: Partial<GraphicUIProperties>) {
		super();

		const { color, alpha, cursor } = attr;

		this.typeId = 'border';
		this.cursor = cursor ?? 'default';
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.draw(attr);
	}

	public draw(attr: Partial<GraphicUIProperties>) {
		const { x, y, width, height, scale } = attr;
		const lineWidth = Math.min(20, Math.max(0.1, 2 / scale));
		this.position.set(x, y);

		this.clear();
		this.lineStyle(lineWidth, this.color);
		this.drawRect(0, 0, width, height);
		this.endFill();
	}

	public serialized() {
		return modelSerializer(this);
	}

	public serializedBounds() {
		return modelBounds(this);
	}
}
