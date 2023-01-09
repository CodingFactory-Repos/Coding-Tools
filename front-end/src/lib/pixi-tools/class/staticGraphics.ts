import { Graphics, utils } from 'pixi.js';
import { StaticGraphicsEvents } from '../types';

/**
 * StaticGraphics is a subclass of PIXI.Graphics that use a custom PIXI.utils.EventEmitter with strongly-typed events.
 *
 * @extends PIXI.Graphics
 * @emits 'dispatch.updated' - Emitted when the graphics object should be updated with new size options.
 * @emits 'dispatch.cleared' - Emitted when the graphics object should be cleared.
 */
export class StaticGraphics extends Graphics {
	/**
	 * Dispatch is a custom emitter for this container.
	 * @public
	 */
	public dispatch: utils.EventEmitter<StaticGraphicsEvents>;

	/**
	 * Creates a new StaticGraphics and intialize the custom emitter;
	 */
	constructor() {
		super();

		this.dispatch = new utils.EventEmitter<StaticGraphicsEvents>();
	}
}
