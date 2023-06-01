import { ModelGraphics } from '../../types/pixi-class';
import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelColorimetry } from '../../utils/modelColorimetry';
import { modelSerializer } from '../../utils/modelSerializer';

export class Tree extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public borderWidth: number;
	public borderColor: number;
	public color: number;

	static registerGraphic(attributes: SerializedGraphic) {
		return new Tree(attributes);
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
		const { width, height, x, y } = bounds;
		this.position.set(x, y);
		this.width = width;
		this.height = height;
		const halfWidth = width / 2;

		this.clear();
		const length = Math.sqrt(halfWidth * halfWidth + height * height);
		this.createFractal(0, 0, length, -Math.PI / 2, 6);
		this.width = width;
		this.height = height;
	}

	public createFractal(x: number, y: number, length: number, angle: number, depth: number) {
		if (depth === 0) return;

		const endX = x + length * Math.cos(angle);
		const endY = y + length * Math.sin(angle);

		this.lineStyle(this.borderWidth, this.color);
		this.moveTo(x, y);
		this.lineTo(endX, endY);

		const childLength = length * 0.75;
		const childAngle = angle - Math.PI / 4;
		this.createFractal(endX, endY, childLength, childAngle, depth - 1);
		this.createFractal(endX, endY, childLength, childAngle + Math.PI / 2, depth - 1);
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
