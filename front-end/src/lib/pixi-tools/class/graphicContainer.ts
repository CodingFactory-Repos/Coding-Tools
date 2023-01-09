import { Container, DisplayObject, utils } from 'pixi.js';
import { GraphicContainerEvents } from '../types';

/**
 * GraphicContainer is a subclass of PIXI.Container that use a custom PIXI.utils.EventEmitter with strongly-typed events.
 *
 * @extends PIXI.Container
 * @emits 'dispatch.selectUpdated' - Emitted when the selection status of the container is updated.
 * @emits 'dispatch.scaleUpdated' - Emitted when the scale of the container is updated.
 * @emits 'dispatch.download' - Emitted when the container is ready to be downloaded.
 */
export class GraphicContainer extends Container<DisplayObject> {
	/**
	 * Dispatch is a custom emitter for this container.
	 * @public
	 */
	public dispatch: utils.EventEmitter<GraphicContainerEvents>;

	/**
	 * Creates a new GraphicContainer and intialize the custom emitter;
	 */
	constructor() {
		super();

		this.dispatch = new utils.EventEmitter<GraphicContainerEvents>();
	}
}
