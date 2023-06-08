import { Container, Point } from 'pixi.js';
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
import { reactive } from 'vue';
import { SerializedContainer, SerializedGraphic } from '../types/pixi-serialize';
import { Normalizer } from './normalyzer';
import { PixiEventMode } from '../types/pixi-enums';
import { TextContainer } from './textContainer';

export class ContainerManager {
	protected readonly viewport: ViewportUI;
	protected readonly resizePlugin: ResizePlugin;
	protected readonly dragPlugin: DragPlugin;
	protected readonly bezierPlugin: BezierPlugin;
	protected readonly bezierManipulationPlugin: BezierManipulationPlugin;
	public readonly wrappedContainer: WrappedContainer;
	public readonly downloadPlugin: DownloadPlugin;
	// No time to fix this, the reactive cause pixi to lose context and cause errors.
	// But at the same time, we need the reactivity, it's very annoying.
	public selectedContainers: Array<CanvasContainer> = reactive([]);
	public _selectedContainers: Array<CanvasContainer> = [];
	public isEditingContainerProperties = false;
	private controlActive = false;
	private copiedElements: Array<SerializedContainer> = [];

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
		this.wrappedContainer = new WrappedContainer(this, this.viewport);
		this.resizePlugin = new ResizePlugin(this.viewport);
		this.dragPlugin = new DragPlugin(this.viewport);
		this.bezierPlugin = new BezierPlugin(this.viewport);
		this.downloadPlugin = new DownloadPlugin(this.viewport);
		this.bezierManipulationPlugin = new BezierManipulationPlugin(this.viewport);

		window.onkeydown = this._onKeyPressed.bind(this);
		window.onkeyup = this.__onKeyReleased.bind(this);
	}

	private _onKeyPressed(e: KeyboardEvent) {
		if (this.isEditingContainerProperties) return;

		const key = e.key;
		if (key === 'Backspace') this._destroyElement();
		else if (key === 'Control') this.controlActive = true;

		if (this.controlActive && key.toLowerCase() === 'c') this._copyDeepElements();
		else if (this.controlActive && key.toLowerCase() === 'v') this._pasteElements();
	}

	private __onKeyReleased(e: KeyboardEvent) {
		const key = e.key;
		if (key === 'Control') this.controlActive = false;
	}

	private _copyDeepElements() {
		this.copiedElements = [];
		for(let n = 0; n < this._selectedContainers.length; n++) {
			const container = this._selectedContainers[n];
			const data = container.serializeData();
			delete data.uuid;
			delete data.properties.frameNumber;

			data.properties.eventMode = PixiEventMode.STATIC;

			if (container instanceof FramedContainer) {
				delete data.background.uuid;
				data.background.properties.eventMode = PixiEventMode.STATIC;

				for(let i = 0; i < data.childs.length; i++) {
					const child = data.childs[i] as SerializedContainer;
					delete child.uuid;
					delete child.properties.frameNumber;

					if (!data.properties.disabled) {
						child.properties.eventMode = PixiEventMode.STATIC;
					}

					if (child?.childs) {
						for(let x = 0; x < child.childs.length; x++) {
							const subChild = child.childs[x];
							delete subChild.uuid;
						}
					}
				}
			} else {
				for(let i = 0; i < data.childs.length; i++) {
					const child = data.childs[i] as SerializedGraphic;
					delete child.uuid;
					child.bounds.x = child.bounds.x + (child.bounds.width / 4);
					child.bounds.y = child.bounds.y - (child.bounds.height / 4);
				}
			}

			this.copiedElements.push(data);
		}
	}

	private _pasteElements() {
		this.deselectAll();
		this.detachPlugins();

		for(let n = 0; n < this.copiedElements.length; n++) {
			const elementData = this.copiedElements[n];
			const container = Normalizer.container(this.viewport, elementData);
			this.viewport.addChild(container);

			//@ts-ignore
			this.selectedContainers.push(container);
			//@ts-ignore
			this._selectedContainers.push(container);
		}

		if(this._selectedContainers.length > 1) {
			this.wrapWithTemporaryParent();
		} else {
			this.drawBorder(this._selectedContainers[0]);
			this.attachPlugins(this._selectedContainers[0]);
		}
	}

	private _destroyElement() {
		if (this.wrappedContainer.children.length > 0) {
			this.wrappedContainer.restoreStateContext();
		}

		const textContainer = this._selectedContainers.filter((ctn) => ctn instanceof TextContainer) as unknown as Array<TextContainer>;
		for(let n = 0; n < textContainer.length; n++) {
			if(textContainer[n].isEditing) {
				return;
			}
		}

		this.viewport.textEditor.innerHTML = '';

		for(let n = 0; n < this._selectedContainers.length; n++) {
			const ctn = this._selectedContainers[n];

			if (!(ctn instanceof LineContainer)) {
				const uuid = [...ctn.linkedLinesUUID];
				uuid.forEach((lineIdentifier) => {
					const line = this.viewport.socketPlugin.elements[lineIdentifier] as LineContainer;
					if (line.startContainer?.containerUUID !== undefined) {
						const container = this.viewport.socketPlugin.elements[
							line.startContainer.containerUUID
						] as CanvasContainer;
						container.detachLine(lineIdentifier);
					}

					if (line.endContainer?.containerUUID !== undefined) {
						const container = this.viewport.socketPlugin.elements[
							line.endContainer.containerUUID
						] as CanvasContainer;
						container.detachLine(lineIdentifier);
					}

					line.destroy();
					this.viewport.socketPlugin.emit('ws-element-deleted', line.uuid);
				});
			} else if (ctn instanceof LineContainer) {
				if (ctn.startContainer?.containerUUID !== undefined) {
					const container = this.viewport.socketPlugin.elements[
						ctn.startContainer.containerUUID
					] as CanvasContainer;
					container.detachLine(ctn.startContainer.containerUUID);
				}

				if (ctn.endContainer?.containerUUID !== undefined) {
					const container = this.viewport.socketPlugin.elements[
						ctn.endContainer.containerUUID
					] as CanvasContainer;
					container.detachLine(ctn.endContainer.containerUUID);
				}
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
		}

		this._resetManagerState();
	}

	private _resetManagerState() {
		this.viewport.destroyBorder();
		this.viewport.destroyResizeHandles();
		this.viewport.destroyBezierHandles();
		this.viewport.destroyResizeHitArea();
		this.viewport.destroyBezierCurveHandle();
		for(let n = 0; n < this._selectedContainers.length; n++) {
			this.handleDeselectTextContainer(this._selectedContainers[n]);
		}
		this.selectedContainers.length = 0;
		this._selectedContainers.length = 0;
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
			this.selectedContainers.push(container);
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
			const ctn = this._selectedContainers.find((el) => el.uuid === container.uuid);
			if (ctn === undefined || ctn === null) return;

			this.detachPlugins();
			this.wrappedContainer.restoreStateContext();
			this._resetManagerState();
			this._selectedContainers.push(ctn);
			this.drawBorder(this._selectedContainers[0]);
			this.attachPlugins(this._selectedContainers[0]);
		}
	}

	public deselectAll() {
		if (this.wrappedContainer.children.length > 0) {
			this.wrappedContainer.restoreStateContext();
		}

		this.viewport.destroyBorder();
		for(let n = 0; n < this._selectedContainers.length; n++) {
			this.handleDeselectTextContainer(this._selectedContainers[n]);
		}
		this.selectedContainers.length = 0;
		this._selectedContainers.length = 0;
	}

	private handleDeselectTextContainer(container: Container) {
		if(!container.destroyed && container instanceof TextContainer) {
			container.endEditing();
		}
	}

	public deselectAllExceptThisContainer(index: number) {
		const unselected: Array<CanvasContainer> = [];

		for (let n = 0; n < this._selectedContainers.length; n++) {
			if (index !== n) {
				unselected.push(this._selectedContainers[n]);
				this.handleDeselectTextContainer(this._selectedContainers[n]);
				this._selectedContainers.splice(n, 1);
				this.selectedContainers.splice(n, 1);
			}
		}

		return unselected;
	}

	public drawBorder(container: PluginContainer) {
		if (container instanceof LineContainer) return;
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

		if (container instanceof LineContainer) {
			this.bezierManipulationPlugin.attach(container);
		} else {
			if (container instanceof TextContainer && container.isNew) return;

			this.resizePlugin.attach(container);
			this.dragPlugin.attach(container);

			if (container instanceof FramedContainer
					|| container instanceof GenericContainer
					|| container instanceof TextContainer
			) {
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
			} else if(this._selectedContainers[0] instanceof TextContainer) {
				this._selectedContainers[0].getBounds();
				return {
					width: this._selectedContainers[0].width,
					height: this._selectedContainers[0].height,
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
