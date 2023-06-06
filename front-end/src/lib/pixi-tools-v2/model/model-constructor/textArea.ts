
import { ModelGraphics } from '../../types/pixi-class';
import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic, SerializedGraphicBounds, SerializedGraphicColorimetry } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelColorimetry } from '../../utils/modelColorimetry';
import { modelSerializer } from '../../utils/modelSerializer';
import * as PIXI from 'pixi.js';

export class TextArea extends ModelGraphics {
  public readonly uuid: string;
  public readonly typeId: GraphicTypeId;
  public cursor: CSSStyleProperty.Cursor;
  public borderWidth: number;
  public borderColor: number;
  public color: number;
  public text: string;
  public isEditing: boolean = false;
  public textSprite: PIXI.Text;
  public inputField: HTMLInputElement;

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
    this.draw(bounds);
  }

  private updateText() {
    if (this.textSprite) {
      this.textSprite.text = this.text;
    }
  }

  public draw(bounds: Partial<ElementBounds>) {
    const { width, height, x, y } = bounds;
    this.position.set(x, y);

    this.removeChildren();

    this.beginFill(this.color);
    if (this.borderWidth > 0) {
      this.lineStyle(this.borderWidth, this.borderColor, 1);
    }
    this.drawRect(0, 0, width, height);
    this.endFill();

    const textStyle = new PIXI.TextStyle({
      fill: 'black',
      fontSize: 14,
    });
    this.textSprite = new PIXI.Text(this.text, textStyle);
    this.textSprite.x = 0;
    this.textSprite.y = 0;
    this.addChild(this.textSprite);

    this.textSprite.eventMode = "static";

    this.textSprite.on('pointerdown', () => {
      this.startEditing();
    });

    this.textSprite.on('pointerup', () => {
      this.endEditing();
    });

    this.updateText();
  }

  public startEditing() {
    if (!this.isEditing) {
      this.isEditing = true;
      this.textSprite.visible = false;
      const viewport = document.getElementById("viewport")


      this.inputField = document.createElement('input');
      this.inputField.type = 'text';
      this.inputField.style.position = 'absolute';
      this.inputField.style.color = 'black';
      this.inputField.style.left = `${this.x}px`;
      this.inputField.style.top = `${this.y}px`;
      this.inputField.style.width = `${this.textSprite.width}px`;
      this.inputField.style.height = `${this.textSprite.height}px`;
      this.inputField.value = this.text;
      this.inputField.addEventListener('input', () => {
        this.text = this.inputField.value;
        this.updateText();
      });
      viewport.appendChild(this.inputField);
      this.inputField.focus();
    }
  }

  public endEditing() {
    if (this.isEditing) {
      this.isEditing = false;
      this.textSprite.visible = true;
      if (this.inputField && this.inputField.parentNode) {
        this.inputField.parentNode.removeChild(this.inputField);
      }

      this.text = this.inputField.value;
      this.updateText();
    }
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
