import { DisplayObjectEvents, Graphics, utils } from 'pixi.js';
import { ResizeCornerKeyLiteral, ResizeEdgeKeyLiteral } from './pixi-type-aliases';

/**
 * Extension of the `Graphics` class from the `pixi.js` library that represents
 * a resizable graphic element.
 * @extends {Graphics}
 */
export class ResizeGraphic extends Graphics {
	/**
	 * The identifier for the resize graphic, either a `ResizeEdgeKeyLiteral` or a `ResizeCornerKeyLiteral`.
	 */
	public id: ResizeEdgeKeyLiteral | ResizeCornerKeyLiteral;
}

/**
 * Extension of the `EventEmitter` class from the `pixi.js` library that allows
 * for custom event handling on a `DisplayObject`.
 *
 * @extends {EventEmitter<DisplayObjectEvents>}
 */
export class PixiEvents extends utils.EventEmitter<DisplayObjectEvents> {}
