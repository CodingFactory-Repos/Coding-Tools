
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

		this.text = 'Exemple de texte';
		this.textStyle = new TextStyle({
			fill: this.color,
			fontSize: 14,
		});
		this.textSprite = new Text(this.text, this.textStyle);
		this.textSprite.eventMode = "static";
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
		const { width, height, x, y } = bounds;
		this.position.set(x, y);

		this.clear();
		this.beginFill(this.color, 0);
		if (this.borderWidth > 0) {
			this.lineStyle(this.borderWidth, this.borderColor, 1);
		}
		this.drawRect(0, 0, width, height);
		this.endFill();
		
		this.textSprite.position.set(0, 0);
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
