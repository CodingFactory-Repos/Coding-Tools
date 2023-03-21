import { Viewport } from 'pixi-viewport';

import { GraphicContainer } from '../class/graphicContainer';
import { StaticGraphics } from '../class/staticGraphics';
import { DownloadPlugin } from '../plugins/download';
import { DragPlugin } from '../plugins/drag';
import { ResizePlugin } from '../plugins/resize';
import { SelectPlugin } from '../plugins/select';
import { ElementOptions } from './pixi-element-options';
import { Stage } from './pixi-type-aliases';

/**
 * _PixiObjectDefinition is an interface made to manipulate a Pixi.js object model.
 */
interface PixiObjectDefinition {
	/**
	 * The stage the object belongs to.
	 */
	readonly stage: Stage;

	/**
	 * The viewport the object belongs to.
	 */
	readonly viewport: Viewport;

	/**
	 * The static graphic of the object.
	 */
	readonly figure: StaticGraphics;

	/**
	 * A flag indicating whether the object is currently being dragged.
	 */
	get isDragging(): boolean;
	set isDragging(value: boolean);

	/**
	 * A flag indicating whether the object is currently being resized.
	 */
	get isResizing(): boolean;
	set isResizing(value: boolean);

	/**
	 * A flag indicating whether the object is currently selected.
	 */
	get isSelected(): boolean;
	set isSelected(value: boolean);

	/**
	 * A flag indicating whether the object is currently being hovered over.
	 */
	get isHovered(): boolean;
	set isHovered(value: boolean);

	/**
	 * Gets the options for the object.
	 * @returns {ElementOptions.ScaledDimensions} The options for the object.
	 */
	getOptions(): ElementOptions.ScaledDimensions;

	/**
	 * Updates the object when the scale changes.
	 * @function
	 */
	updateOnScale(): void;

	/**
	 * Destory the object and its children.
	 * It also remove any events coming from the plugins.
	 * @function
	 */
	destroyObject(): void;

	/**
	 * The X position of the object.
	 */
	x: number;

	/**
	 * The Y position of the object.
	 */
	y: number;
}

/**
 * An interface representing a set of plugins for manipulating PixiObjects.
 */
export interface PixiObjectPluggin {
	dragPlugin: DragPlugin<PixiObject>;
	selectPlugin: SelectPlugin<PixiObject>;
	resizePlugin: ResizePlugin<PixiObject>;
	downloadPlugin: DownloadPlugin<PixiObject>;
}

/**
 * PixiObject representing a Pixi.js object model extends by custom events
 */
export type PixiObject = PixiObjectDefinition & GraphicContainer;

export interface InitialResizeState {
	width: number;
	height: number;
	x: number;
	y: number;
}
