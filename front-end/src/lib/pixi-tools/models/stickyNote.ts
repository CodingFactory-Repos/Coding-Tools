import { Viewport } from 'pixi-viewport';

import { DownloadPlugin } from '../plugins/download';
import { SelectPlugin } from './../plugins/select';
import { StaticRectangle } from '../../pixi-tools/models/static/rectangle';
import { ResizePlugin } from '../plugins/resize';
import { DragPlugin } from '../plugins/drag';
import { ElementOptions, PixiObject, PixiObjectPluggin, Stage } from '../types';
import { GraphicContainer } from '../class/graphicContainer';

/**
 * StickyNote is a class that extends from `GraphicContainer` and implements the `PixiObject` interface.
 * It is a container with a `StaticRectangle` as its child, and it has various plugins attached to it for
 * different functionalities such as dragging, resizing, selecting and downloading.
 */
export class StickyNote extends GraphicContainer implements PixiObject, PixiObjectPluggin {
	/**
	 * The stage to which this PixiObject belongs.
	 * @private
	 */
	private readonly _stage: Stage;

	/**
	 * The viewport to which this PixiObject belongs.
	 * @private
	 */
	private readonly _viewport: Viewport;

	/**
	 * The static graphic of this PixiObject.
	 * @private
	 */
	private readonly _figure: StaticRectangle;

	/**
	 * A flag variable to determine whether the PixiObject is being dragged or not.
	 * @private
	 */
	private _isDragging = false;

	/**
	 * A flag variable to determine whether the PixiObject is being selected or not.
	 * @private
	 */
	private _isSelected = false;

	/**
	 * A flag variable to determine whether the PixiObject is being resized or not.
	 * @private
	 */
	private _isResizing = false;

	/**
	 * A flag variable to determine whether the PixiObject is being hovered or not.
	 * @private
	 */
	private _isHovered = false;

	/**
	 * This plugin adds dragging functionality to a PixiObject.
	 *
	 * It extends the PixiObject with the `enableDragging` and `disableDragging` methods,
	 * which allow the object to be dragged with the mouse or touch events.
	 * @private
	 */
	private _dragPlugin: DragPlugin<this>;

	/**
	 * This plugin adds selecting functionality to a PixiObject.
	 *
	 * It extends the PixiObject with the `enableSelect` and `disableSelect methods,
	 * which allow the object to be selected with the mouse or touch events.
	 * @private
	 */
	private _selectPlugin: SelectPlugin<this>;

	/**
	 * This plugin adds resizing functionality to a PixiObject.
	 *
	 * It extends the PixiObject with the `enableResize` and `disableResize` methods,
	 * which allow the object to be resized in multiple ways with the mouse or touch events.
	 * @private
	 */
	private _resizePlugin: ResizePlugin<this>;

	/**
	 * This plugin adds download functionality to a PixiObject.
	 *
	 * It extends the PixiObject with the `enableDownload` and `disableDownload` methods,
	 * which allow the object to be downloaded.
	 * @private
	 */
	private _downloadPlugin: DownloadPlugin<this>;

	/**
	 * Constructor for the StickyNote class.
	 *
	 * @param stage - The `Stage` object to which this `StickyNote` belongs.
	 * @param viewport - The `Viewport` object to which this `StickyNote` belongs.
	 * @param options - The options for the `StaticRectangle` object that is the child of this `StickyNote`.
	 */
	constructor(stage: Stage, viewport: Viewport, options: Partial<ElementOptions.ShapeProperties>) {
		super();

		this._stage = stage;
		this._viewport = viewport;
		this._figure = new StaticRectangle(options);

		this.x = this._figure.x;
		this.y = this._figure.y;
		this.cursor = 'pointer';
		this.interactive = true;

		this.addChild(this._figure);
		this.addChild(this._figure.border);
		this._stage.addChild(this);

		this._dragPlugin = new DragPlugin(this);
		this._dragPlugin.enableDragging();

		this._selectPlugin = new SelectPlugin(this);
		this._selectPlugin.enableSelect();

		this._resizePlugin = new ResizePlugin(this, this._figure);
		this._resizePlugin.enableResize();

		this._downloadPlugin = new DownloadPlugin(this);
		this._downloadPlugin.enableDownload();
	}

	/**
	 * Destroys the PixiObject and all its child elements.
	 *
	 * - Disable all the attached plugins
	 * - Destroy all child elements
	 * - Destroy the PixiObject itself
	 * @public
	 */
	public destroyObject() {
		this._dragPlugin.disableDragging();
		this._selectPlugin.disableSelect();
		this._resizePlugin.disableResize();
		this._downloadPlugin.disabledDownload();

		this.children.forEach((el) => el.destroy());
		this.destroy();
	}

	/**
	 * Returns the current dimension of the PixiObject, including the width, height and position, aswell as the scene scale level.
	 * @returns The current options for the scene.
	 * @public
	 */
	public getOptions(): ElementOptions.ScaledDimensions {
		return {
			positionX: this._figure.x,
			positionY: this._figure.y,
			width: this._figure.width,
			height: this._figure.height,
			scale: this.viewport.scale.x,
		};
	}

	/**
	 * Updates the StickyNote element if hovered or selected.
	 * @public
	 */
	public updateOnScale() {
		this._updateSelect();

		if (this.isSelected) {
			this.dispatch.emit('scaleUpdated');
		}
	}

	/**
	 * Updates the state of the `figure` object based on the `isSelected` and `isHovered` flags of the PixiObject.
	 * If either flag is `true`, the `figure` object will emit an 'updated' event.
	 * Otherwise, the `figure` object will emit a 'cleared' event.
	 * @private
	 */
	private _updateSelect() {
		if (this._isSelected || this.isHovered) {
			this._figure.dispatch.emit('updated', this.getOptions());
		} else {
			this._figure.dispatch.emit('cleared');
		}
	}

	public get stage(): Stage {
		return this._stage;
	}

	public get viewport(): Viewport {
		return this._viewport;
	}

	public get figure(): StaticRectangle {
		return this._figure;
	}

	public get isDragging(): boolean {
		return this._isDragging;
	}

	public set isDragging(value: boolean) {
		this._isDragging = value;
	}

	public get isResizing(): boolean {
		return this._isResizing;
	}

	public set isResizing(value: boolean) {
		this._isResizing = value;
		this._updateSelect();
	}

	public get isSelected(): boolean {
		return this._isSelected;
	}

	public set isSelected(value: boolean) {
		this._isSelected = value;
		this.updateOnScale();

		this.dispatch.emit('selectUpdated', this._isSelected);
	}

	public get isHovered(): boolean {
		return this._isHovered;
	}

	public set isHovered(value: boolean) {
		this._isHovered = value;
		this.updateOnScale();
	}

	public get dragPlugin(): DragPlugin<this> {
		return this._dragPlugin;
	}

	public get selectPlugin(): SelectPlugin<this> {
		return this._selectPlugin;
	}

	public get resizePlugin(): ResizePlugin<this> {
		return this._resizePlugin;
	}

	public get downloadPlugin(): DownloadPlugin<this> {
		return this._downloadPlugin;
	}
}
