import { TextStyle, Text } from 'pixi.js';
import { ModelGraphics } from '../../types/pixi-class';
import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelColorimetry } from '../../utils/modelColorimetry';
import { modelSerializer } from '../../utils/modelSerializer';

export class TextArea extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public borderWidth: number;
	public borderColor: number;
	public color: number;

	public text: string;
	public textSprite: Text;
	public inputField: HTMLInputElement;
	public textStyle: TextStyle;

	static registerGraphic(attributes: SerializedGraphic) {
		return new TextArea(attributes);
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

		this.text = properties.text ?? '';
		this.textStyle = new TextStyle({
			fill: this.color,
			fontSize: properties.fontSize ?? 14,
			fontStyle: properties.fontStyle ?? TextStyle.defaultStyle.fontStyle,
			fontWeight: properties.fontWeight ?? TextStyle.defaultStyle.fontWeight,
			fontFamily: properties.fontFamily ?? TextStyle.defaultStyle.fontFamily,
			align: properties.fontAlign ?? TextStyle.defaultStyle.align,
			padding: properties.fontPadding ?? 5,
		});
		this.textSprite = new Text(this.text, this.textStyle);

		this.textSprite.eventMode = properties.eventMode;
		this.addChild(this.textSprite);
		this.updateText();

		this.draw(bounds);
	}

	public updateText() {
		if (this.textSprite) {
			this.textSprite.text = this.text;
		}
	}

	public draw(bounds: Partial<ElementBounds>) {
		const { x, y } = bounds;
		this.position.set(x, y);
		this.textStyle.fill = this.color;
		this.textSprite.position.set(this.textStyle.padding, this.textStyle.padding);


		this.clear();
		this.beginFill(null, 0);
		if (this.borderWidth > 0) {
			this.lineStyle(this.borderWidth, this.borderColor, 1);
		}
		this.drawRect(0, 0, this.width, this.height);
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
