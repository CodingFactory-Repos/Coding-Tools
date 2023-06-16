import { LINE_CAP, LINE_JOIN, TextStyle, Text } from 'pixi.js';
import { ModelGraphics } from '../../types/pixi-class';
import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelColorimetry } from '../../utils/modelColorimetry';
import { modelSerializer } from '../../utils/modelSerializer';

export class Cursor extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public borderWidth: number;
	public borderColor: number;
	public radius: number;
	public color: number;

	public text: string;
	public textSprite: Text;
	public inputField: HTMLInputElement;
	public textStyle: TextStyle;

	static registerGraphic(attributes: SerializedGraphic) {
		return new Cursor(attributes);
	}

	constructor(attributes: SerializedGraphic) {
		super();

		const { uuid, typeId, bounds, properties } = attributes;

		this.uuid = uuid;
		this.typeId = typeId as GraphicTypeId;
		this.eventMode = properties.eventMode;
		this.cursor = properties.cursor;
		this.color = properties.color;
		this.alpha = properties.alpha;

		this.text = properties.text ?? 'unknown';
		this.textStyle = new TextStyle({
			fill: 0x000000,
			fontSize: 12,
			padding: 3,
		});
		this.textSprite = new Text(this.text, this.textStyle);
		this.textSprite.eventMode = properties.eventMode;
		this.addChild(this.textSprite);

		this.draw(bounds);
	}

	public draw(bounds: Partial<ElementBounds>) {
		const { x, y, width, height } = bounds;
		this.position.set(x, y);
		this.textStyle.fill = 0x000000;
		this.textSprite.position.set(10 + this.textStyle.padding, 15 + this.textStyle.padding);

		this.clear();
		this.lineStyle({ width: 3, color: this.color, join: LINE_JOIN.ROUND });
		this.line.cap = LINE_CAP.ROUND;
		this.beginFill(this.color);
		
		const angle = Math.PI / 4; // 45 degrees in radians
		const halfDiagonal = Math.sqrt(width * width + height * height) / 2;
		const centerX = width / 2;
		const centerY = height / 2;
		const startX = centerX - Math.cos(angle) * halfDiagonal;
		const startY = centerY + Math.sin(angle) * halfDiagonal;
		const endX = centerX + Math.cos(angle) * halfDiagonal;
		const endY = centerY + Math.sin(angle) * halfDiagonal;
	  
		this.moveTo(startX, startY);
		this.lineTo(centerX, centerY);
		this.lineTo(endX, endY);
		this.lineTo(startX, startY);

	this.drawRect(this.textSprite.x, this.textSprite.y + 1, this.textSprite.width, this.textSprite.height - 2);
		this.endFill();
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
