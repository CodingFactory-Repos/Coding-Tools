/**
 * A namespace for element options.
 * @namespace ElementOptions
 */
export namespace ElementOptions {
	/**
	 * An interface for scaled dimensions.
	 * @interface ScaledDimensions
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
		 * @type {number}
		 */
		positionX: number;
	
		/**
		 * The Y position of the element, in pixels.
		 * @type {number}
		 */
		positionY: number;
	}
}
