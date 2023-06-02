import { SmoothGraphics, SmoothGraphicsData } from '@pixi/graphics-smooth';
import { ModelGraphics } from '../../types/pixi-class';
import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelColorimetry } from '../../utils/modelColorimetry';
import { modelSerializer } from '../../utils/modelSerializer';
import { Matrix } from 'pixi.js';

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
		this.borderWidth = properties.borderWidth || 4;
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
		let maxLength = 0;
		const diff = this.calculatePercentageDifference(width, height);
		if(height < width) {
			maxLength = (height * (1 + Math.min(diff, 0.1))) / 2;
		} else {
			maxLength = Math.min(width, height) / 2;
		}

		const initialLength = maxLength * 0.6;

		this.clear();
		this.beginFill(0, 0);
		this.drawRect(0,0, width, height);
		this.createFractal(width / 2, height, initialLength, -Math.PI / 2, 6);
	}

	private calculatePercentageDifference(a: number, b: number) {
		return Math.abs(((b - a) / a) * 100) / 100;
	}

	public createFractal(x: number, y: number, length: number, angle: number, depth: number) {
		if (depth === 0) return;

		const endX = x + length * Math.cos(angle);
		const endY = y + length * Math.sin(angle);

		this.lineStyle(this.borderWidth, this.color);
		this.moveTo(x, y);
		this.lineTo(endX, endY);

		const leftAngle = angle + Math.PI / 4;
		const rightAngle = angle - Math.PI / 4;
		const newLength = length * 0.7;
		const newDepth = depth - 1;

		this.createFractal(endX, endY, newLength, leftAngle, newDepth);
		this.createFractal(endX, endY, newLength, rightAngle, newDepth);
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
