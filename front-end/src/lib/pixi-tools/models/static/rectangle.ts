import { Graphics } from 'pixi.js';

import { StaticGraphics } from '../../class/staticGraphics';
import { ElementOptions } from '../../types';

/**
 * Class representing a static rectangle.
 * @extends StaticGraphics
 */
export class StaticRectangle extends StaticGraphics {
	/**
	 * The border of the rectangle.
	 * @private
	 */
	private readonly _border: Graphics;

	/**
	 * The color of the rectangle.
	 */
	public color: number = 0xffff99;

	/**
	 * Creates a new StaticRectangle instance with a graphic rectangle shape and awaitng for emitter events.
	 * @param {Partial<ElementOptions.ShapeProperties>} props - The props for the rectangle.
	 */
	constructor(props: Partial<ElementOptions.ShapeProperties>) {
		super();

		const w = props.width || 100;
		const h = props.height || 100;

		if (props.color)
			this.color = props.color;

		this.beginFill(this.color);
		this.drawRoundedRect(0, 0, w, h, 0);
		this.endFill();

		this._border = new Graphics();
		this.dispatch.on("updated", (dimension) => this._updateBorder(dimension));
		this.dispatch.on("cleared", this._clearBorder);
	}

	/**
	 * Updates the border of the rectangle with new dimensions.
	 * @param {ElementOptions.ScaledDimensions} options - The new dimensions for the rectangle.
	 * @private
	 */
	private _updateBorder(options: ElementOptions.ScaledDimensions) {
		const { scale, width, height, positionX, positionY } = options;
		const lineWidth = Math.max(2 / scale, .5);

		this._border.clear();
		this._border.lineStyle(lineWidth, 0x0c8ce9, 2);
		this._border.moveTo(positionX, positionY);
		this._border.lineTo(positionX + width, positionY);
		this._border.lineTo(positionX + width, positionY + height);
		this._border.lineTo(positionX, positionY + height);
		this._border.lineTo(positionX, positionY - lineWidth / 2);
		this._border.endFill();
	}

	/**
	 * Clears the border of the rectangle.
	 * @private
	 */
	private _clearBorder() {
		this._border.clear();
	}

	/**
	 * Gets the border of the rectangle.
	 * @returns  The border of the rectangle.
	 */
	get border() {
		return this._border;
	}
}