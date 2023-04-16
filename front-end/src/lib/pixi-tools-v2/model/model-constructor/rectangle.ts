import { ModelGraphics } from '../../types/pixi-class';
import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelSerializer } from '../../utils/modelSerializer';

export class Rectangle extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public color: number;

	static registerGraphic(attributes: SerializedGraphic) {
		return new Rectangle(attributes);
	}

	constructor(attributes: SerializedGraphic) {
		super();

		const { uuid, typeId, bounds, properties } = attributes;

		this.uuid = uuid;
		this.typeId = typeId as GraphicTypeId;
		this.interactive = properties.interactive;
		this.cursor = properties.cursor;
		this.color = properties.color;
		this.alpha = properties.alpha;

		this.draw(bounds);
	}

	public draw(bounds: ElementBounds) {
		const { width, height, x, y } = bounds;
		this.position.set(x, y);
		this.height = height;
		this.width = width;

		this.clear();
		this.beginFill(this.color);
		this.drawRect(0, 0, width, height);
		this.endFill();
	}

	public serialized() {
		return modelSerializer(this);
	}
}
