import { IPointData, FederatedPointerEvent } from 'pixi.js';
import { PixiObject, PixiEvents } from '../types';

/**
 * A plugin that manages the dragging with a mouse or touch input of a given PixiObject.
 * @extends {PixiEvents}
 */
export class DragPlugin<T extends PixiObject> extends PixiEvents {
	/**
	 * The PixiObject that this plugin manages.
	 * @private
	 */
	private readonly _element: T;

	/**
	 * The last position of the cursor during a dragging operation.
	 * @private
	 */
	private _lastPosition: IPointData;

	/**
	 * Creates an instance of DragPlugin.
	 * @param ref A reference to the PixiObject that the plugin will be applied to.
	 */
	constructor(ref: T) {
		super();

		this._element = ref;
		this._lastPosition = undefined;
	}

	/**
	 * Handles the pointer down.
	 * When the pointer is pressed, register the position of the cursor local to the parent element.
	 * Add the event listener pointer move to the stage and the element to keep the dragging constant.
	 * @param event - The `pointerdown` event.
	 * @private
	 */
	private _startDrag = (event: FederatedPointerEvent) => {
		event.stopPropagation();

		this._lastPosition = this._element.parent.toLocal(event.global);
		this._element.stage.on('pointermove', this._moveDrag);
		this._element.on('pointermove', this._moveDrag);
	};

	/**
	 * Handles the pointer up.
	 * When the pointer is released, the isDragging property of the PixiObject is set to false and the event is removed.
	 * Update the element cursor to `pointer`.
	 * @param event - The `pointerup` event.
	 * @private
	 */
	private _stopDrag = (event: FederatedPointerEvent) => {
		event.stopPropagation();

		this._lastPosition = undefined;
		this._element.isDragging = false;
		this._element.cursor = 'pointer';
		this._element.stage.off('pointermove', this._moveDrag);
		this._element.off('pointermove', this._moveDrag);
	};

	/**
	 * Handles the pointer move.
	 * When the pointer move, the isDragging property of the PixiObject is set to false and the PixiObject position is recalculated.
	 * Update the element cursor to `grabbing`.
	 * @param event - The `pointermove` event.
	 * @private
	 */
	private _moveDrag = (event: FederatedPointerEvent) => {
		if (!this._element.isDragging) {
			this._element.cursor = 'grabbing';
			this._element.isDragging = true;
		}

		if (this._lastPosition) {
			const newPosition = this._element.parent.toLocal(event.global);

			this._element.x += newPosition.x - this._lastPosition.x;
			this._element.y += newPosition.y - this._lastPosition.y;
			this._lastPosition = newPosition;
		}
	};

	/**
	 * Enables the dragging behavior for the associated PixiObject.
	 * @public
	 */
	public enableDragging = () => {
		this._element.on('pointerdown', this._startDrag);
		this._element.on('pointerup', this._stopDrag);
	};

	/**
	 * Disables the dragging behavior for the associated PixiObject.
	 * @public
	 */
	public disableDragging = () => {
		this._element.off('pointerdown', this._startDrag);
		this._element.off('pointerup', this._stopDrag);
		this._element.off('pointermove', this._moveDrag);
		this._element.stage.off('pointermove', this._moveDrag);
	};
}
