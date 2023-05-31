import { ModelGraphics } from '../../types/pixi-class';
import { GraphicUIProperties } from '../../types/pixi-ui';
import { InternalTypeId } from '../../types/pixi-serialize';
import { modelSerializer } from '../../utils/modelSerializer';
import { modelBounds } from '../../utils/modelBounds';
import { modelColorimetry } from '../../utils/modelColorimetry';

export class Handle extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: InternalTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public handleId: number;
	public radius: number;
	public color: number;

	constructor(attr: Partial<GraphicUIProperties>) {
		super();

		const { color, cursor, alpha, radius } = attr;

		this.typeId = 'handle';
		this.cursor = cursor ?? 'default';
		this.color = color ?? 0x0c8ce9;
		this.alpha = alpha ?? 1;
		this.eventMode = 'static';
		this.radius = radius;
		this.draw(attr);
	}

	public draw(attr: Partial<GraphicUIProperties>) {
		const { x, y, scale } = attr;
		const lineWidth = Math.max(0.05, 1 / scale);
		const rad = Math.max(0.25, (this.radius * 1) / scale);
		this.position.set(x, y);

		this.clear();
		this.lineStyle(lineWidth, 0x0c8ce9);
		this.beginFill(this.color);
		this.drawCircle(0, 0, rad);
		this.endFill();
	}

	public serialized() {
		return modelSerializer(this);
	}

	public serializedBounds() {
		return modelBounds(this);
	}

	public serializedColorimetry() {
		return modelColorimetry(this);
	}
}
