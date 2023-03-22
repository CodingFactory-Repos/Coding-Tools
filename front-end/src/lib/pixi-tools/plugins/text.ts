import { Text } from 'pixi.js';
import { PixiEvents, PixiObject } from '../types';

export class TextPlugin<T extends PixiObject> extends PixiEvents {
	/**
	 * The PixiObject that this plugin manages.
	 * @private
	 */
	private readonly _element: T;

	/**
	 * The text element of this PixiObject.
	 * @private
	 */
	private readonly _text: Text;

	/**
	 * The textarea used to edit the Pixi.Text
	 */
	private readonly _input: HTMLTextAreaElement;

	/**
	 * Creates an instance of TextPlugin.
	 * @param ref A reference to the PixiObject that the plugin will be applied to.
	 */
	constructor(ref: T) {
		super();

		this._element = ref;

		this._text = new Text('Type your text here', {
			fontFamily: 'Arial',
			fontSize: 24,
			fill: 0x000000,
			align: 'left',
			wordWrap: true,
			wordWrapWidth: this._element.figure.width,
			breakWords: true,
			lineHeight: 24,
		});
		this._text.x = this._element.figure.x + 10;
		this._text.y = this._element.figure.y + 10;
		this._text.interactive = true;
		this._text.cursor = 'text';

		this._input = document.createElement('textarea');
		this._input.style.position = 'absolute';
		this._input.style.padding = 'unset';
		this._input.style.textAlign = this._text.style.align;
		this._input.style.color = 'transparent';
		this._input.style.caretColor = '#000000';
		this._input.style.fontFamily = this._text.style.fontFamily as string;
		this._input.style.border = 'none';
		this._input.style.outline = 'none';
		this._input.style.backgroundColor = 'transparent';
		this._input.style.overflow = 'hidden';
		this._input.style.resize = 'none';

		this._element.addChild(this._text);
		document.body.appendChild(this._input);
	}

	private _updatePosition = () => {
		this._input.value = this._text.text;
		this._input.style.display = 'block';
		this._input.style.left = `${this._text.x}px`;
		this._input.style.top = `${this._text.y}px`;
		this._input.style.width = `${this._text.width}px`;
		this._input.style.height = `${this._text.height}px`;
		this._input.style.fontSize = `${this._text.style.fontSize}px`;
	};

	private _updateText = () => {
		this._text.dirty = true;
		this._text.text = this._input.value;
		this._text.updateText(true);
	};

	private _hideInput = () => {
		this._input.style.display = 'none';
	};

	/**
	 * Enables the text functionality for the PixiObject.
	 * @public
	 */
	public enableDynamicText = () => {
		this._updatePosition();
		this._input.addEventListener('input', this._updateText);
	};

	/**
	 * Disables the text functionality for the PixiObject.
	 * @public
	 */
	public disabledDynamicText = () => {
		this._input.removeEventListener('input', this._updateText);
	};
}
