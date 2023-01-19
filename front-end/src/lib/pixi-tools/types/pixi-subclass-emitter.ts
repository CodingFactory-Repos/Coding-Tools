import { ElementOptions } from './pixi-element-options';

/**
 * EventParameters is a type that maps the arguments of a function type to a tuple.
 *
 * @template E - A type that represents a set of event function types.
 */
export type EventParameters<E> = {
	[K in keyof E]: E[K];
};

/**
 * ArgumentMap is a type that maps the arguments of a function type to a tuple.
 *
 * @template E - A type that represents a set of event function types.
 */
export type ArgumentMapNever<E> = {
	[K in keyof E]: E[K] extends (...args: infer U) => unknown ? U : never;
};

/**
 * ArgumentMapTyped is a type that maps the arguments of a function type to a tuple.
 * It infer the function type as the value from the key, as long as they key value is defined.
 *
 * @template E - A type that represents a set of event function types.
 */
export type ArgumentMapTyped<E> = {
	[K in keyof E]: E[K] extends (...args: infer U) => unknown ? U : E[K];
};

/**
 * Define the custom events of a GraphicContainer.
 */
export interface GraphicContainerEvents {
	/**
	 * Emitted when the container's selection status is updated.
	 */
	selectUpdated: [value: boolean];

	/**
	 * Emitted when the container's scale is updated.
	 */
	scaleUpdated: [];

	/**
	 * Emitted when the container is downloaded.
	 */
	download: [mimeType: string];
}

/**
 * Define the custom events of a StaticGraphics.
 */
export interface StaticGraphicsEvents {
	/**
	 * Emitted when the graphics object should be updated with new size options.
	 */
	updated: [dimension: ElementOptions.ScaledDimensions | Partial<ElementOptions.ScaledDimensions>];

	/**
	 * Emitted when the graphics object should be cleared.
	 */
	cleared: [];
}
