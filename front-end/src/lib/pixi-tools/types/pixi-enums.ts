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
	MIME_PNG = 'image/png',
	/** MIME type for a Joint Photographic Experts Group image */
	MIME_JPG = 'image/jpeg',
	/** MIME type for a Web Picture format image */
	MIME_WEBP = 'image/webp',
	/** MIME type for a Portable Document Format document */
	MIME_PDF = 'application/pdf',
}
