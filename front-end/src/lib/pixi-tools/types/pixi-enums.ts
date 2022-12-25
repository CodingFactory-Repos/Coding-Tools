/**
 * Enum for the different edges of an element that can be resized.
 * @enum {string}
 */
export enum ResizeEdge {
	/** The top edge of the element. */
	TOP = 'top',
	/** The right edge of the element. */
	RIGHT = 'right',
	/** The bottom edge of the element. */
	BOTTOM = 'bottom',
	/** The left edge of the element. */
	LEFT = 'left',
}

/**
 * Enum for the different corners of an element that can be resized.
 * @enum {string}
 */
export enum ResizeCorner {
	/** The top-right corner of the element. */
	TOPRIGHT = 'topRight',
	/** The top-left corner of the element. */
	TOPLEFT = 'topLeft',
	/** The bottom-left corner of the element. */
	BOTTOMLEFT = 'botLeft',
	/** The bottom-right corner of the element. */
	BOTTOMRIGHT = 'botRight',
}
