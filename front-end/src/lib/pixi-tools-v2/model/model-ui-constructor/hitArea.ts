import { ModelGraphics } from '../../types/pixi-class';
import { GraphicUIProperties } from '../../types/pixi-ui';
import { InternalTypeId } from '../../types/pixi-serialize';
import { modelSerializer } from '../../utils/modelSerializer';
import { modelBounds } from '../../utils/modelBounds';
import { modelColorimetry } from '../../utils/modelColorimetry';
import { PixiEventMode } from '../../types/pixi-enums';

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
		this.eventMode = PixiEventMode.STATIC;
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
		return modelSerializer(this);
	}

	public serializedBounds() {
		return modelBounds(this);
	}

	public serializedColorimetry() {
		return modelColorimetry(this);
	}
}
