import { DisplayObjectEvents } from "pixi.js";

/**
 * ArgumentMap is a type that maps the arguments of a function type to a tuple.
 *
 * @template T - A type that represents a set of function types.
 */
export type ArgumentMap<T> = {
	[K in keyof T]: T[K] extends (...args: infer U) => any ? U : never;
};

/**
 * ContainerEvents is an interface that extends the event emitter interface of PIXI.DisplayObject to allow for
 * custom events to be emitted and subscribed to.
 *
 * @extends PIXI.DisplayObjectEvents
 * @emits 'selectUpdated' - Emitted when the container's selection status is updated.
 * @emits 'scaleUpdated' - Emitted when the container's scale is updated.
 * @emits 'download' - Emitted when the container is downloaded.
 */
export interface ContainerEvents extends DisplayObjectEvents {
	/**
	 * Emitted when the container's selection status is updated.
	 */
	selectUpdated: [boolean];
	
	/**
	 * Emitted when the container's scale is updated.
	 */
	scaleUpdated: [];
	
	/**
	 * Emitted when the container is downloaded.
	 */
	download: [string];
}

/**
 * GraphicsEvents is an interface that extends the event emitter interface of PIXI.DisplayObject to allow for
 * custom events to be emitted and subscribed to.
 *
 * @extends PIXI.DisplayObjectEvents
 * @emits 'updated' - Emitted when the graphics object is updated with new size options.
 * @emits 'cleared' - Emitted when the graphics object is cleared.
 */
export interface GraphicsEvents extends DisplayObjectEvents {
	/**
	 * Emitted when the graphics object should be updated with new size options.
	 */
	updated: [];
	
	/**
	 * Emitted when the graphics object should be cleared.
	 */
	cleared: [];
}

