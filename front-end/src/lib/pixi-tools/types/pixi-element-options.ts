/**
 * A namespace for element options.
 * @namespace ElementOptions
 */
export namespace ElementOptions {
	/**
	 * Define the scaled dimensions options to transform an element.
	 * @memberof ElementOptions
	 */
	export interface ScaledDimensions {
		/**
		 * The scale factor for the element.
		 */
		scale: number;

		/**
		 * The width of the element, in pixels.
		 */
		width: number;

		/**
		 * The height of the element, in pixels.
		 */
		height: number;

		/**
		 * The X position of the element, in pixels.
		 */
		positionX: number;

		/**
		 * The Y position of the element, in pixels.
		 */
		positionY: number;
	}

	/**
	 * Define the transform box properties of a resize graphic.
	 * @extends ScaledDimensions
	 * @memberof ElementOptions
	 */
	export interface TransformBoxProperties extends ScaledDimensions {
		/**
		 * The size of the resize/transform handles, in pixels.
		 */
		rectSize: number;
	}

	/**
	 * Define the shape properties of a simple graphic shape.
	 * @memberof ElementOptions
	 */
	export interface ShapeProperties {
		/**
		 * The color of the shape, in hexadecimal.
		 */
		color: number;

		/**
		 * The width of the element, in pixels.
		 */
		width: number;

		/**
		 * The height of the element, in pixels.
		 */
		height: number;

		/**
		 * The X position of the element, in pixels.
		 */
		positionX: number;

		/**
		 * The Y position of the element, in pixels.
		 */
		positionY: number;
	}
}
