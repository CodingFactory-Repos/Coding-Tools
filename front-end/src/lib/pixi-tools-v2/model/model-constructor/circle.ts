import { ModelGraphics } from '../../types/pixi-class';
import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelColorimetry } from '../../utils/modelColorimetry';
import { modelSerializer } from '../../utils/modelSerializer';

export class Circle extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public borderWidth: number;
	public borderColor: number;
	public radius: number;
	public color: number;

	static registerGraphic(attributes: SerializedGraphic) {
		return new Circle(attributes);
	}

	constructor(attributes: SerializedGraphic) {
		super();

		const { uuid, typeId, bounds, properties } = attributes;

		this.uuid = uuid;
		this.typeId = typeId as GraphicTypeId;
		this.eventMode = properties.eventMode;
		this.borderWidth = properties.borderWidth;
		this.borderColor = properties.borderColor;
		this.cursor = properties.cursor;
		this.color = properties.color;
		this.alpha = properties.alpha;

		this.draw(bounds);
	}

	public draw(bounds: Partial<ElementBounds>) {
		const { x, y, radius, width, height } = bounds;
		this.radius = radius;
		this.position.set(x, y);

		this.clear();
		if (this.borderWidth > 0) this.lineStyle(this.borderWidth, this.borderColor, 1);
		this.beginFill(this.color);
		this.drawCircle(this.radius, this.radius, this.radius);
		this.endFill();

		if(width !== undefined && width > 0) this.width = width;
		if(height !== undefined && height > 0) this.height = height;
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
