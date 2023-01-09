import { FederatedPointerEvent, Graphics, Point, Rectangle } from 'pixi.js';
import {
	PixiObject,
	PixiEvents,
	ResizeGraphic,
	TransformKeys,
	ResizeEdge,
	ResizeCorner,
	ResizeEdgeValLiteral,
	ResizeCornerValLiteral,
	ElementOptions,
	InitialResizeState,
} from '../types';
import { TransformBox } from '../models/transformBox';

/**
 * A plugin that provides resizing functionality for a given PixiObject.
 *
 * Support corner resizing, corner ratio resizing and edge resizing.
 *
 * @extends PixiEvents
 */
export class ResizePlugin<T extends PixiObject> extends PixiEvents {
	/**
	 * The PixiObject that this plugin manages.
	 * @private
	 */
	private readonly _element: T;

	/**
	 * The graphics object being resized.
	 * @private
	 */
	private readonly _figure: Graphics;

	/**
	 * A visual representation of the resize handles and borders for the PixiObject.
	 * @private
	 */
	private readonly _transformBox: TransformBox & TransformKeys;

	/**
	 * The last position of the cursor during a resize operation.
	 * @private
	 */
	private _lastPosition: Point;

	/**
	 * The initial state of the graphic object being resized, including its width, height, and position.
	 * @private
	 */
	private _initialState: InitialResizeState;

	/**
	 * The current resize handle or border being dragged during a resize operation.
	 * @private
	 */
	private _currentTarget?: ResizeGraphic;

	/**
	 * The id of the current resize handle or border being dragged.
	 * @private
	 */
	private _targetId: ResizeEdgeValLiteral | ResizeCornerValLiteral;

	/**
	 * A flag indicating whether the shift key is being held during a resize operation.
	 * @private
	 */
	private _isHoldShift = false;

	/**
	 * A flag indicating whether the resize concern the corner.
	 * @private
	 */
	private _isCornerResize = false;

	/**
	 * A flag indicating whether the resize concern the corner.
	 * @private
	 */
	private _isEdgeResize = false;

	/**
	 * Creates an instance of ResizePlugin.
	 *
	 * @param ref A reference to the PixiObject that the plugin will be applied to.
	 * @param figure - The graphics object being resized.
	 */
	constructor(ref: T, figure: Graphics) {
		super();

		this._figure = figure;
		this._element = ref;
		this._lastPosition = undefined;

		const props = this._element.getOptions() as ElementOptions.TransformBoxProperties;
		this._transformBox = new TransformBox(props);
		this._element.addChild(this._transformBox.graphic);
	}

	/**
	 * Handles the pointer down.
	 * When the pointer is pressed, register the initial state of the graphics, the handle or border selected,
	 * the id of the handle or border and the position of the cursor local to the parent element.
	 * Update the element cursor to the handle or border cursor.
	 *
	 * Attach multiple events on the stage to assure a smooth resize and add the move event to the handle or border.
	 * @param event - The `pointerdown` event.
	 * @private
	 */
	private _startResize = (event: FederatedPointerEvent) => {
		event.stopPropagation();

		const { width, height, x, y } = this._figure;
		this._initialState = { width, height, x, y };
		this._currentTarget = event.target as ResizeGraphic;
		this._lastPosition = this._element.viewport.toWorld(event.global.clone());

		this._element.cursor = this._currentTarget.cursor;
		this._element.viewport.cursor = this._currentTarget.cursor;
		this._element.on('pointerup', this._endResize);
		this._element.stage.on('pointerup', this._endResize);
		this._element.stage.on('mouseleave', this._endResize);
		this._element.stage.on('pointermove', this._updateResize);

		const targetKeyId = this._currentTarget.id;

		if (targetKeyId in ResizeEdge) {
			this._targetId = ResizeEdge[targetKeyId];
			this._transformBox[this._targetId].on('pointermove', this._updateResize);
			this._isEdgeResize = true;
		}

		if (targetKeyId in ResizeCorner) {
			this._targetId = ResizeCorner[targetKeyId];
			this._transformBox[this._targetId].on('pointermove', this._updateResize);
			this._isCornerResize = true;
		}
	};

	/**
	 * Handles the pointer up if any.
	 * When the pointer is release, the isResizing property of the PixiObject is set to false.
	 * Stops the resize behavior, removing all event listeners and resetting internal state.
	 * Update the element cursor to `pointer`.
	 * @param event - The `pointerup` event if any.
	 * @private
	 */
	private _endResize = (event?: FederatedPointerEvent) => {
		if (event) event.stopPropagation();

		this._lastPosition = undefined;
		setTimeout(() => {
			this._element.isResizing = false;
			this._isHoldShift = false;
		}, 10);

		this._isEdgeResize = false;
		this._isCornerResize = false;
		this._element.cursor = 'pointer';
		this._element.viewport.cursor = undefined;
		this._element.off('pointerup', this._endResize);
		this._element.stage.off('pointerup', this._endResize);
		this._element.stage.off('mouseleave', this._endResize);
		this._element.stage.off('pointermove', this._updateResize);

		if (this._targetId) {
			this._transformBox[this._targetId].off('pointermove', this._updateResize);
		}
	};

	/**
	 * Handles the pointer move.
	 * When the pointer move, the isDragging property of the PixiObject is set to true.
	 *
	 * Calculate the dimensions and position of the associated element based on the current cursor position.
	 *
	 * Determine which handle or border is select to define how the graphics will be resized.
	 *
	 * @param event - The `pointermove` event.
	 * @private
	 */
	private _updateResize = (event: FederatedPointerEvent) => {
		event.stopPropagation();

		if (this._lastPosition && this._initialState) {
			const newCursorPosition = event.global.clone();
			const transformedCursorPosition = this._element.viewport.toWorld(newCursorPosition);
			const dx = transformedCursorPosition.x - this._lastPosition.x;
			const dy = transformedCursorPosition.y - this._lastPosition.y;
			const shiftKey = event.originalEvent.shiftKey;

			if (this._isEdgeResize) {
				return this._resizeEdge(dx, dy);
			}

			if (this._isCornerResize && shiftKey) {
				return this._resizeCornerRatio(dx);
			}

			if (this._isCornerResize) {
				return this._resizeCorner(dx, dy);
			}
		}
	};

	/**
	 * Resizes the target element's bounding box while maintaining the aspect ratio.
	 * @param dx - The difference between the current cursor position and the initial position on the x-axis.
	 * @private
	 */
	private _resizeCornerRatio = (dx: number) => {
		if (!this._isHoldShift) this._isHoldShift = true;
		const ratioA = this._figure.height / this._figure.width;
		const ratioB = this._figure.width / this._figure.height;

		switch (this._currentTarget) {
			case this._transformBox.topLeft:
				this._figure.width = this._initialState.width - dx;
				this._figure.height = this._figure.width * ratioA;
				this._figure.x = this._initialState.x + this._initialState.width - this._figure.width;
				this._figure.y = this._initialState.y + this._initialState.height - this._figure.height;
				break;
			case this._transformBox.topRight:
				this._figure.width = this._initialState.width + dx;
				this._figure.height = this._figure.width * ratioA;
				this._figure.y = this._initialState.y + this._initialState.height - this._figure.height;
				break;
			case this._transformBox.botLeft:
				this._figure.width = this._initialState.width - dx;
				this._figure.height = this._figure.width / ratioB;
				this._figure.x = this._initialState.x + this._initialState.width - this._figure.width;
				break;
			case this._transformBox.botRight:
				this._figure.width = this._initialState.width + dx;
				this._figure.height = this._figure.width / ratioB;
				break;
		}
		this._element.isResizing = true;
		this._updateTransformBoxPosition();
	};

	/**
	 * Resizes the target element's bounding box without maintaining the aspect ratio.
	 * @param dx - The difference between the current cursor position and the initial position on the x-axis.
	 * @param dy - The difference between the current cursor position and the initial position on the y-axis.
	 * @return Stop the resizing if the isHoldShift property is true, meaning the shift key was released.
	 * @private
	 */
	private _resizeCorner = (dx: number, dy: number) => {
		if (this._isHoldShift) return this._endResize();

		switch (this._currentTarget) {
			case this._transformBox.topLeft:
				this._figure.width = this._initialState.width - dx;
				this._figure.height = this._initialState.height - dy;
				this._figure.x = this._initialState.x + dx;
				this._figure.y = this._initialState.y + dy;
				break;
			case this._transformBox.topRight:
				this._figure.width = this._initialState.width + dx;
				this._figure.height = this._initialState.height - dy;
				this._figure.y = this._initialState.y + dy;
				break;
			case this._transformBox.botLeft:
				this._figure.width = this._initialState.width - dx;
				this._figure.height = this._initialState.height + dy;
				this._figure.x = this._initialState.x + dx;
				break;
			case this._transformBox.botRight:
				this._figure.width = this._initialState.width + dx;
				this._figure.height = this._initialState.height + dy;
				break;
		}
		this._element.isResizing = true;
		this._updateTransformBoxPosition();
	};

	/**
	 * Resizes the target element's bounding box on the x-axis or y-axis.
	 * @param dx - The difference between the current cursor position and the initial position on the x-axis.
	 * @param dy - The difference between the current cursor position and the initial position on the y-axis.
	 * @private
	 */
	private _resizeEdge = (dx: number, dy: number) => {
		switch (this._currentTarget) {
			case this._transformBox.top:
				this._figure.height = this._initialState.height - dy;
				this._figure.y = this._initialState.y + dy;
				break;
			case this._transformBox.right:
				this._figure.width = this._initialState.width + dx;
				break;
			case this._transformBox.bottom:
				this._figure.height = this._initialState.height + dy;
				break;
			case this._transformBox.left:
				this._figure.width = this._initialState.width - dx;
				this._figure.x = this._initialState.x + dx;
				break;
		}
		this._element.isResizing = true;
		this._updateTransformBoxPosition();
	};

	/**
	 * Updates the position and dimensions of the transform box graphic to match those of the element being resized.
	 * @private
	 */
	private _updateTransformBoxPosition = () => {
		const { scale, width, height, positionX, positionY } = this._element.getOptions();

		const lineWidth = 2 / scale;
		const rectSize = this._transformBox.rectSize / scale;
		const hitAreaMargin = this._transformBox.hitAreaMargin;

		this._transformBox.top.clear();
		this._transformBox.bottom.clear();
		this._transformBox.left.clear();
		this._transformBox.right.clear();
		this._transformBox.topLeft.clear();
		this._transformBox.topRight.clear();
		this._transformBox.botLeft.clear();
		this._transformBox.botRight.clear();

		this._transformBox.top.beginFill(0x0c8ce9);
		this._transformBox.top.drawRect(positionX, positionY, width, 1);
		this._transformBox.top.endFill();

		this._transformBox.bottom.beginFill(0x0c8ce9);
		this._transformBox.bottom.drawRect(positionX, positionY + height - 1, width, 1);
		this._transformBox.bottom.endFill();

		this._transformBox.left.beginFill(0x0c8ce9);
		this._transformBox.left.drawRect(positionX, positionY, 1, height);
		this._transformBox.left.endFill();

		this._transformBox.right.beginFill(0x0c8ce9);
		this._transformBox.right.drawRect(positionX + width - 1, positionY, 1, height);
		this._transformBox.right.endFill();

		this._transformBox.top.hitArea = new Rectangle(
			positionX - hitAreaMargin,
			positionY - hitAreaMargin,
			width + hitAreaMargin * 2,
			1 + hitAreaMargin * 2,
		);
		this._transformBox.bottom.hitArea = new Rectangle(
			positionX - hitAreaMargin,
			positionY + height - 1 - hitAreaMargin,
			width + hitAreaMargin * 2,
			1 + hitAreaMargin * 2,
		);
		this._transformBox.left.hitArea = new Rectangle(
			positionX - hitAreaMargin,
			positionY - hitAreaMargin,
			1 + hitAreaMargin * 2,
			height + hitAreaMargin * 2,
		);
		this._transformBox.right.hitArea = new Rectangle(
			positionX + width - 1 - hitAreaMargin,
			positionY - hitAreaMargin,
			1 + hitAreaMargin * 2,
			height + hitAreaMargin * 2,
		);

		this._transformBox.topLeft.beginFill(0xffffff);
		this._transformBox.topLeft.lineStyle(lineWidth, 0x0c8ce9, 1);
		this._transformBox.topLeft.drawRect(0, 0, rectSize, rectSize);
		this._transformBox.topLeft.endFill();

		this._transformBox.topRight.beginFill(0xffffff);
		this._transformBox.topRight.lineStyle(lineWidth, 0x0c8ce9, 1);
		this._transformBox.topRight.drawRect(0, 0, rectSize, rectSize);
		this._transformBox.topRight.endFill();

		this._transformBox.botLeft.beginFill(0xffffff);
		this._transformBox.botLeft.lineStyle(lineWidth, 0x0c8ce9, 1);
		this._transformBox.botLeft.drawRect(0, 0, rectSize, rectSize);
		this._transformBox.botLeft.endFill();

		this._transformBox.botRight.beginFill(0xffffff);
		this._transformBox.botRight.lineStyle(lineWidth, 0x0c8ce9, 1);
		this._transformBox.botRight.drawRect(0, 0, rectSize, rectSize);
		this._transformBox.botRight.endFill();

		this._transformBox.topLeft.x = positionX - rectSize / 2;
		this._transformBox.topLeft.y = positionY - rectSize / 2;
		this._transformBox.topRight.x = positionX + width - rectSize / 2;
		this._transformBox.topRight.y = positionY - rectSize / 2;
		this._transformBox.botLeft.x = positionX - rectSize / 2;
		this._transformBox.botLeft.y = positionY + height - rectSize / 2;
		this._transformBox.botRight.x = positionX + width - rectSize / 2;
		this._transformBox.botRight.y = positionY + height - rectSize / 2;
	};

	/**
	 * Enables the resize behavior for the associated PixiObject.
	 * Add the necessary event listeners to the transform box graphic when resizing,
	 * and to the element when being affected by others plugins.
	 * @public
	 */
	public enableResize = () => {
		this._transformBox.top
			.on('pointerdown', this._startResize)
			.on('pointerup', this._endResize)
			.on('pointerupoutsidecapture', this._endResize);

		this._transformBox.bottom
			.on('pointerdown', this._startResize)
			.on('pointerup', this._endResize)
			.on('pointerupoutsidecapture', this._endResize);

		this._transformBox.left
			.on('pointerdown', this._startResize)
			.on('pointerup', this._endResize)
			.on('pointerupoutsidecapture', this._endResize);

		this._transformBox.right
			.on('pointerdown', this._startResize)
			.on('pointerup', this._endResize)
			.on('pointerupoutsidecapture', this._endResize);

		this._transformBox.topLeft
			.on('pointerdown', this._startResize)
			.on('pointerup', this._endResize)
			.on('pointerupoutsidecapture', this._endResize);

		this._transformBox.topRight
			.on('pointerdown', this._startResize)
			.on('pointerup', this._endResize)
			.on('pointerupoutsidecapture', this._endResize);

		this._transformBox.botLeft
			.on('pointerdown', this._startResize)
			.on('pointerup', this._endResize)
			.on('pointerupoutsidecapture', this._endResize);

		this._transformBox.botRight
			.on('pointerdown', this._startResize)
			.on('pointerup', this._endResize)
			.on('pointerupoutsidecapture', this._endResize);

		this._element.dispatch.on('selectUpdated', (value: boolean) => this.displayGraphic(value));
		this._element.dispatch.on('scaleUpdated', this._updateTransformBoxPosition);
	};

	/**
	 * Disables the resize behavior for the associated PixiObject.
	 * Remove all the event listeners to the transform box graphic and the element.
	 * @public
	 */
	public disableResize = () => {
		this._transformBox.top
			.off('pointerdown', this._startResize)
			.off('pointerup', this._endResize)
			.off('pointerupoutsidecapture', this._endResize)
			.off('pointermove', this._updateResize);

		this._transformBox.bottom
			.off('pointerdown', this._startResize)
			.off('pointerup', this._endResize)
			.off('pointerupoutsidecapture', this._endResize)
			.off('pointermove', this._updateResize);

		this._transformBox.left
			.off('pointerdown', this._startResize)
			.off('pointerup', this._endResize)
			.off('pointerupoutsidecapture', this._endResize)
			.off('pointermove', this._updateResize);

		this._transformBox.right
			.off('pointerdown', this._startResize)
			.off('pointerup', this._endResize)
			.off('pointerupoutsidecapture', this._endResize)
			.off('pointermove', this._updateResize);

		this._transformBox.topLeft
			.off('pointerdown', this._startResize)
			.off('pointerup', this._endResize)
			.off('pointerupoutsidecapture', this._endResize)
			.off('pointermove', this._updateResize);

		this._transformBox.topRight
			.off('pointerdown', this._startResize)
			.off('pointerup', this._endResize)
			.off('pointerupoutsidecapture', this._endResize)
			.off('pointermove', this._updateResize);

		this._transformBox.botLeft
			.off('pointerdown', this._startResize)
			.off('pointerup', this._endResize)
			.off('pointerupoutsidecapture', this._endResize)
			.off('pointermove', this._updateResize);

		this._transformBox.botRight
			.off('pointerdown', this._startResize)
			.off('pointerup', this._endResize)
			.off('pointerupoutsidecapture', this._endResize)
			.off('pointermove', this._updateResize);

		this._element.dispatch.off('selectUpdated', (value: boolean) => this.displayGraphic(value));
		this._element.dispatch.off('scaleUpdated', this._updateTransformBoxPosition);
		this._element.off('pointerup', this._endResize);
		this._element.stage.off('pointerup', this._endResize);
		this._element.stage.off('mouseleave', this._endResize);
		this._element.stage.off('pointermove', this._updateResize);
	};

	/**
	 * Shows or hides the transform box graphic depending on the value of the `visible` parameter.
	 * @param visible - Whether the transform box should be shown or hidden.
	 * @public
	 */
	public displayGraphic = (value: boolean) => {
		this._transformBox.graphic.visible = value;
	};
}
