import { Point } from 'pixi.js';
import { WrappedContainer } from './wrappedContainer';
import { FramedContainer } from './framedContainer';
import { ResizePlugin } from '../plugins/containerResizePlugin';
import { DragPlugin } from '../plugins/containerDragPlugin';
import { ViewportUI } from '../viewportUI';

import type { CanvasContainer, PluginContainer } from '../types/pixi-aliases';
import { DownloadPlugin } from '../plugins/managerDownloadPlugin';
import { GenericContainer } from './genericContainer';
import { BezierPlugin } from '../plugins/containerBezierLinkPlugin';
import { LineContainer } from './lineContainer';
import { BezierManipulationPlugin } from '../plugins/bezierManipulationPlugin';

export class ContainerManager {
	protected readonly viewport: ViewportUI;
	protected readonly resizePlugin: ResizePlugin;
	protected readonly dragPlugin: DragPlugin;
	protected readonly bezierPlugin: BezierPlugin;
	protected readonly bezierManipulationPlugin: BezierManipulationPlugin;
	public readonly wrappedContainer: WrappedContainer;
	public readonly downloadPlugin: DownloadPlugin;
	private _selectedContainers: Array<CanvasContainer>;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
		this.wrappedContainer = new WrappedContainer(this, this.viewport);
		this.resizePlugin = new ResizePlugin(this.viewport);
		this.dragPlugin = new DragPlugin(this.viewport);
		this.bezierPlugin = new BezierPlugin(this.viewport);
		this.downloadPlugin = new DownloadPlugin(this.viewport);
		this.bezierManipulationPlugin = new BezierManipulationPlugin(this.viewport);
		this._selectedContainers = [];

		window.onkeydown = this._destroySelected.bind(this);
	}

	private _destroySelected(e: KeyboardEvent) {
		const key = e.key;

		if (key === 'Backspace') {
			if (this.wrappedContainer.children.length > 0) {
				this.wrappedContainer.restoreStateContext();
			}

			this._selectedContainers.forEach((ctn) => {
				if (!(ctn instanceof LineContainer)) {
					const uuid = [...ctn.linkedLinesUUID];
					uuid.forEach((lineIdentifier) => {
						const line = this.viewport.socketPlugin.elements[lineIdentifier] as LineContainer;
						if (line.startContainer?.containerUUID !== undefined) {
							const container = this.viewport.socketPlugin.elements[line.startContainer.containerUUID] as CanvasContainer;
							container.detachLine(lineIdentifier);
						}

						if (line.endContainer?.containerUUID !== undefined) {
							const container = this.viewport.socketPlugin.elements[line.endContainer.containerUUID] as CanvasContainer;
							container.detachLine(lineIdentifier);
						}

						line.destroy();
						this.viewport.socketPlugin.emit('ws-element-deleted', line.uuid);
					})
				}

				if (this.viewport.socketPlugin) {
					if (ctn instanceof GenericContainer && ctn.isAttachedToFrame) {
						const frame = ctn.parent.parent as FramedContainer;
						this.viewport.socketPlugin.emit('ws-element-deleted', ctn.uuid, frame.uuid);
					} else {
						this.viewport.socketPlugin.emit('ws-element-deleted', ctn.uuid);
					}
				}
				ctn.destroy();
			});
			this.viewport.destroyBorder();
			this.viewport.destroyResizeHandles();
			this.viewport.destroyBezierHandles();
			this.viewport.destroyResizeHitArea();
			this.viewport.destroyBezierCurveHandle();
			this._selectedContainers = [];
		}
	}

	/**
	 * Selects the given container and updates the selected containers list
	 * @param container
	 * @param isShift
	 * @returns void
	 */
	public selectContainer(container: CanvasContainer, isShift: boolean) {
		if (!this._selectedContainers.includes(container)) {
			// Select the container and retrieve the position index
			const len = this._selectedContainers.push(container);
			const index = len - 1;

			// If the shift key is not pressed and there is more than one children of the wrappedContainer,
			// add all of its children to the viewport + remove them and destroy its border.
			if (!isShift && this.wrappedContainer.children.length > 0) {
				this.detachPlugins();
				this.wrappedContainer.restoreStateContext();
				this.viewport.destroyBorder();
			}

			// If the shift key is pressed and there is more than one container selected,
			// wrap the selected containers in a temporary parent container and destroy any existing borders.
			if (isShift && len > 1) {
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
		} else if (this.wrappedContainer.children.length > 0) {
			const index = this._selectedContainers.findIndex((el) => el === container);
			if (index === -1) return;

			this.detachPlugins();
			this.wrappedContainer.restoreStateContext();
			this.viewport.destroyBorder();
			this.deselectAllExceptThisContainer(index);
			this.drawBorder(this._selectedContainers[0]);
			this.attachPlugins(this._selectedContainers[0]);
		}
	}

	public deselectAll() {
		if (this.wrappedContainer.children.length > 0) {
			this.wrappedContainer.restoreStateContext();
		}

		this.viewport.destroyBorder();
		this._selectedContainers = [];
	}

	public deselectAllExceptThisContainer(index: number) {
		const selected: Array<CanvasContainer> = [];
		const unselected: Array<CanvasContainer> = [];

		for (let n = 0; n < this._selectedContainers.length; n++) {
			if (index === n) {
				selected.push(this._selectedContainers[n]);
			} else {
				unselected.push(this._selectedContainers[n]);
			}
		}

		this._selectedContainers = selected;
		return unselected;
	}

	public drawBorder(container: PluginContainer) {
		if(container instanceof LineContainer) return;
		const borderOptions = container.getGeometry();

		this.viewport.createBorder({
			...borderOptions,
			scale: this.viewport.scaled,
		});
	}

	public wrapWithTemporaryParent() {
		this.wrappedContainer.createWrappedBox(this._selectedContainers);
		const borderOptions = this.wrappedContainer.getGeometry();
		this.viewport.createBorder({
			...borderOptions,
			scale: this.viewport.scaled,
		});
		this.viewport.addChildAt(this.wrappedContainer, this.viewport.children.length);
		this.attachPlugins(this.wrappedContainer);
	}

	public attachPlugins(container: PluginContainer) {
		this.viewport.getVisibleChildren();

		if(container instanceof LineContainer) {
			this.bezierManipulationPlugin.attach(container);
		} else {
			this.resizePlugin.attach(container);
			this.dragPlugin.attach(container);

			if(container instanceof FramedContainer || container instanceof GenericContainer) {
				this.bezierPlugin.attach(container);
			}
		}
	}

	public detachPlugins() {
		this.resizePlugin.detach();
		this.dragPlugin.detach();
		this.bezierPlugin.detach();
		this.bezierManipulationPlugin.detach();
		this.viewport.onScreenChildren.length = 0;
	}

	public getSelectedCenter() {
		const len = this._selectedContainers.length;
		if (len === 0) return null;

		let minX = Number.MAX_SAFE_INTEGER;
		let minY = Number.MAX_SAFE_INTEGER;
		let maxX = Number.MIN_SAFE_INTEGER;
		let maxY = Number.MIN_SAFE_INTEGER;

		for (let n = 0; n < len; n++) {
			const { x, y, width, height } = this._selectedContainers[n].getGeometry();

			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x + width > maxX) maxX = x + width;
			if (y + height > maxY) maxY = y + height;
		}

		return new Point((minX + maxX) / 2, (minY + maxY) / 2);
	}

	public getSelectedSize() {
		if (this._selectedContainers.length === 0) return null;

		if (this._selectedContainers.length > 1) {
			return {
				width: this.wrappedContainer.width,
				height: this.wrappedContainer.height,
			};
		} else {
			if (this._selectedContainers[0] instanceof FramedContainer) {
				return {
					width: this._selectedContainers[0].mainContainer.width,
					height: this._selectedContainers[0].mainContainer.height,
				};
			} else {
				return {
					width: this._selectedContainers[0].width,
					height: this._selectedContainers[0].height,
				};
			}
		}
	}

	public downloadSelected(mime: string) {
		if (!this.isActive) return;

		if (this._selectedContainers.length > 1) {
			this.downloadPlugin.downloadMany(this._selectedContainers, mime);
		} else {
			this.downloadPlugin.downloadOne(this._selectedContainers[0], mime);
		}
	}

	get isActive() {
		return this._selectedContainers.length > 0;
	}
}
