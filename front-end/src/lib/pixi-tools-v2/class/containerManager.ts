import { WrappedContainer } from './wrappedContainer';
import { CanvasContainer, PluginContainer } from '../types/pixi-container-options';
import { FramedContainer } from './framedContainer';
import { GenericContainer } from './genericContainer';
import { ResizePlugin } from '../plugins/resizePlugin';
import { ViewportUI } from "../viewportUI";
import { Point } from 'pixi.js';
import { DragPlugin } from '../plugins/dragPlugin';

export class ContainerManager {
	protected readonly viewport: ViewportUI;
	protected readonly resizePlugin: ResizePlugin;
	protected readonly dragPlugin: DragPlugin;
	private _selectedContainers: Array<CanvasContainer>;
	public readonly wrappedContainer: WrappedContainer;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
		this.wrappedContainer = new WrappedContainer(this.viewport);
		this.resizePlugin = new ResizePlugin(this.viewport);
		this.dragPlugin = new DragPlugin(this.viewport);
		this._selectedContainers = [];

		window.onkeydown = this._destroySelected.bind(this);
	}

	private _destroySelected(e: KeyboardEvent) {
		const key = e.key;

		if (key === "Backspace") {
			this._selectedContainers.forEach((ctn) => ctn.destroy());
			this.viewport.destroyBorder();
			this.viewport.destroyResizeHandles();
			this.viewport.destroyResizeHitArea();
			this._selectedContainers = [];
		}
	}

	/**
	 * Selects the given container and updates the selected containers list
	 * @param container
	 * @param isShift
	 * @returns void
	 */
	public selectContainer(container: CanvasContainer, isShift: boolean, ) {
		if (!this._selectedContainers.includes(container)) {
			const shouldReturn = this.fixFrameChildrenContext(container);
			if(shouldReturn) return;

			// Select the container and retrieve the position index
			const len = this._selectedContainers.push(container);
			const index = len - 1;

			// If the shift key is not pressed and there is more than one children of the wrappedContainer,
			// add all of its children to the viewport + remove them and destroy its border.
			if (!isShift && this.wrappedContainer.children.length > 0) {
				this.detachPlugins();
				this.viewport.destroyBorder();
				this.wrappedContainer.restoreOriginChildren();
				this.wrappedContainer.removeChildren();
			}
			
			// If the shift key is pressed and there is more than one container selected,
			// wrap the selected containers in a temporary parent container and destroy any existing borders.
			 if(isShift && len > 1) {
				this.detachPlugins();
				this.viewport.destroyBorder();
				this.wrapWithTemporaryParent();
				return;
			
			// If there is more than one container selected,
			// deselect all other containers except for the current container and destroy any existing borders.
			} else if (len > 1) {
				this.detachPlugins();
				this.deselectAllExceptThisContainer(index);
				this.viewport.destroyBorder();
				this.drawBorder(this._selectedContainers[0]);
				this.attachPlugins(this._selectedContainers[0]);
				return;
			}

			// Draw the border of the currently selected element.
			this.detachPlugins();
			this.drawBorder(this._selectedContainers[index]);
			this.attachPlugins(this._selectedContainers[index]);

		// If there is more than one children of the wrappedContainer,
		//  add all of its children to the viewport + remove them and destroy its border, then draw the border of the clicked element.
		} else if(this.wrappedContainer.children.length > 0) {
			const index = this._selectedContainers.findIndex(el => el === container);
			if(index === -1) return;

			this.detachPlugins();
			this.viewport.destroyBorder();
			this.wrappedContainer.restoreOriginChildren();
			this.wrappedContainer.removeChildren();
			this.deselectAllExceptThisContainer(index);
			this.drawBorder(this._selectedContainers[0]);
			this.attachPlugins(this._selectedContainers[0]);
		}
	}

	/**
	 * This method is used once, and has its name suggest it's a fix of an issue.
	 * This issue could potentially be reworked later, but for readability it will be separated to avoid dirtying the selectContainer method.
	 */
	private fixFrameChildrenContext(container: CanvasContainer) {
		// If the container is a FramedContainer,
		// try to find all its selected children,
		// if some children were found, remove them from the selected array and destroy any existing borders and finally add them back to the frame.
		//! This prevent a bug where the children context is lost when doing : select children of frame then select frame
		if(container instanceof FramedContainer) {
			const childsOfFrame = this._selectedContainers.filter((ctn) => ctn.frameNumber === container.frameNumber);
			if(childsOfFrame.length > 0) {
				this._selectedContainers = this._selectedContainers.filter((ctn) => !childsOfFrame.includes(ctn));
				this.viewport.destroyBorder();
				container.mainContainer.addChild(...childsOfFrame);
			}

		//! This prevent a bug where the children context is lost when doing : select frame then select children of frame
		} else if(container instanceof GenericContainer && container.frameNumber !== -1) {
			const frames = this._selectedContainers.filter((ctn) => ctn.id === "frame") as Array<FramedContainer>;
			for(let n = 0; n < frames.length; n++) {
				if(frames[n].mainContainer.children[n].parent === container.parent) {
					return true;
				}
			}
		}

		return false;
	}

	public deselectAll() {
		if(this.wrappedContainer.children.length > 0) {
			this.viewport.destroyBorder();
			this.wrappedContainer.restoreOriginChildren();
			this.wrappedContainer.removeChildren();
		}

		this.viewport.destroyBorder();
		this._selectedContainers = [];
	}

	public deselectAllExceptThisContainer(index: number) {
		const selected: Array<CanvasContainer> = [];
		const unselected: Array<CanvasContainer> = [];

		for(let n = 0; n < this._selectedContainers.length; n++) {
			if(index === n) {
				selected.push(this._selectedContainers[n]);
			} else {
				unselected.push(this._selectedContainers[n]);
			}
		}

		this._selectedContainers = selected;
		return unselected;
	}

	public drawBorder(container: PluginContainer) {
		const borderOptions = container.getGeometry();

		this.viewport.createBorder({
			...borderOptions,
			scale: this.viewport.scaled
		});
	}

	public wrapWithTemporaryParent() {
		this.wrappedContainer.addChild(...this._selectedContainers);
		const borderOptions = this.wrappedContainer.getGeometry();
		this.viewport.createBorder({
			...borderOptions,
			scale: this.viewport.scaled
		});
		this.wrappedContainer.hitArea = this.wrappedContainer.getLocalBounds();
		this.viewport.addChild(this.wrappedContainer);
		this.attachPlugins(this.wrappedContainer);
	}

	public attachPlugins(container: PluginContainer) {
		this.resizePlugin.attach(container);
		this.dragPlugin.attach(container);
	}

	public detachPlugins() {
		this.resizePlugin.detach();
		this.dragPlugin.detach();
	}

	public getSelectedCenter() {
		const len = this._selectedContainers.length;
		if(len === 0) return null;

		let minX = Infinity;
		let minY = Infinity;
		let maxX = 0;
		let maxY = 0;

		for(let n = 0; n < len; n++) {
			const { x, y, width, height } = this._selectedContainers[n].getGeometry();

			if(x < minX) minX = x;
			if(y < minY) minY = y;
			if(x + width > maxX) maxX = x + width;
			if(y + height > maxY) maxY = y + height;
		}

		return new Point((minX + maxX) / 2, (minY + maxY) / 2);
	}

	public getSelectedSize() {
		if(this._selectedContainers.length === 0) return null;

		if(this._selectedContainers.length > 1) {
			return {
				width: this.wrappedContainer.width,
				height: this.wrappedContainer.height,
			}
		} else {
			return {
				width: this._selectedContainers[0].width,
				height: this._selectedContainers[0].height,
			}
		}
	}

	get isActive() {
		return this._selectedContainers.length > 0;
	}
}