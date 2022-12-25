/**
 * Enum for the different edges of an element that can be resized.
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

/**
 * Enum representing the different types of file formats that can be downloaded.
 */
export enum DownloadType {
	/** MIME type for a Portable Network Graphics image */
	PNG = 'image/png',
	/** MIME type for a Joint Photographic Experts Group image */
	JPG = 'image/jpeg',
	/** MIME type for a Web Picture format image */
	WEBP = 'image/webp',
	/** MIME type for a Portable Document Format document */
	PDF = 'application/pdf',
}