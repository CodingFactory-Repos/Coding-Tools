import { Viewport } from "pixi-viewport";

import { GraphicContainer } from "../class/graphicContainer";
import { ElementOptions } from "./pixi-element-options";
import { Stage } from "./pixi-type-aliases";

/**
 * _PixiObjectDefinition is an interface made to manipulate a Pixi.js object model.
 */
interface _PixiObjectDefinition {
	/**
	 * The stage the object belongs to.
	 */
	readonly stage: Stage;

	/**
	 * The viewport the object belongs to.
	 */
	readonly viewport: Viewport;

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
	 * The X position of the object.
	 */
	x: number;

	/**
	 * The Y position of the object.
	 */
	y: number;
}

/**
 * PixiObject representing a Pixi.js object model extends by custom events
 * @typedef {_PixiObjectDefinition & GraphicContainer} PixiObject
 */
export type PixiObject = _PixiObjectDefinition & GraphicContainer;