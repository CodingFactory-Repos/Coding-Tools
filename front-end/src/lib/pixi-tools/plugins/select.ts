import { FederatedPointerEvent } from 'pixi.js';
import { PixiEvents, PixiObject } from '../types';

/**
 * A plugin that manages the selection and hover state of a given PixiObject.
 * When the object is clicked, it becomes selected and can only be unselected by clicking outside of the object.
 * The object can also be hovered, indicated by a change in its appearance.
 */
export class SelectPlugin<T extends PixiObject> extends PixiEvents {
	/**
	 * The PixiObject that this plugin manages.
	 */
	private readonly _element: T;

	/**
	 * Creates a new instance of SelectPlugin.
	 * @param ref The PixiObject to manage.
	 */
	constructor(ref: T) {
		super();

		this._element = ref;
	}

	/**
	 * Handles the selection of the PixiObject.
	 * If the PixiObject is already selected, this method does nothing.
	 * Otherwise, the PixiObject becomes selected and an event listener is added to unselect it when the stage is clicked.
	 */
	private _select = () => {
		if (this._element.isSelected) return;
		this._element.isSelected = true;
		this._element.stage.on('pointerdown', this._unselect);
	}

	/**
	 * Handles the unselection of the PixiObject.
	 * If the stage is clicked, the PixiObject becomes unselected and the event listener is removed.
	 * @param event The pointerdown event.
	 */
	private _unselect = (event: FederatedPointerEvent) => {
		if (event.target !== this._element) {
			this._element.isSelected = false;
			this._element.stage.off('pointerdown', this._unselect);
		}
	}

	/**
	 * Handles the hover of the PixiObject.
	 * When the PixiObject is hovered, the isHovered property of the PixiObject is set to true.
	 * If the object is already selected or already hovered, the hover event is ignored.
	 */
	private _hover = () => {
		if (this._element.isHovered || this._element.isSelected) return;
		this._element.isHovered = true;
		this._element.on('pointerout', this._unhover);
	}

	/**
	 * Handles the unhover of the PixiObject.
	 * When the PixiObject is no longer hovered, the isHovered property of the PixiObject is set to false and the event listener is removed.
	 */
	private _unhover = () => {
		this._element.isHovered = false;
		this._element.off('pointerout', this._unhover);
	}

	/**
	 * Enables the select and and hover behavior for the associated PixiObject.
	 */
	public enableSelect = () => {
		this._element.on('pointerdown', this._select);
		this._element.on('pointerover', this._hover);
	}

	/**
	 * Disables the select, hover and deselect behavior for the associated PixiObject.
	 */
	public disableSelect = () => {
		this._element.off('pointerdown', this._select);
		this._element.off('pointerout', this._unhover);
		this._element.stage.off('pointerdown', this._unselect);
	}
}