import { Container } from 'pixi.js';
import { Scene } from "@/lib/pixi-tools-v2/scene";
import { WrappedContainer } from './wrappedContainer';

export class ContainerManager {
	private _scene: Scene;
	private _selectedContainers: Array<Container>;
	private _wrappedContainer: WrappedContainer;
	private _dragPlugin: any;
	private _selectPlugin: any;
	private _resizePlugin: any;
	private _downloadPlugin: any;

	constructor(scene: Scene) {
		this._scene = scene;
		this._selectedContainers = [];
		this._wrappedContainer = new WrappedContainer(scene.viewport);
		this._dragPlugin = null;
		this._selectPlugin = null;
		this._resizePlugin = null;
		this._downloadPlugin = null;

		window.onkeydown = this.destroySelected.bind(this);
	}

	public destroySelected(e: KeyboardEvent) {
		const key = e.key;

		if (key === "Backspace") {
			this._selectedContainers.forEach((ctn) => ctn.destroy());
			this._wrappedContainer.destroyBorder();
		}
	}

	/**
	 * Selects the given container and updates the selected containers list
	 * @param container
	 * @param isShift 
	 * @returns void
	 */
	public selectContainer(container: Container, isShift: boolean) {
		if (!this._selectedContainers.includes(container)) {
			const len = this._selectedContainers.push(container);
			const index = len - 1;

			// If the shift key is not pressed and there is more than one children of the wrappedContainer,
			// add all of its children to the viewport + remove them and destroy its border.
			if (!isShift && this._wrappedContainer.children.length > 0) {
				this._wrappedContainer.destroyBorder();
				this._wrappedContainer.restoreOriginChildren();
				this._wrappedContainer.removeChildren();
			}
			
			// If the shift key is pressed and there is more than one container selected,
			// wrap the selected containers in a temporary parent container and destroy any existing borders.
			 if(isShift && len > 1) {
				this.destroyBorder(this._selectedContainers);
				this.wrapWithTemporaryParent();
				return;
			
			// If there is more than one container selected,
			// deselect all other containers except for the current container and destroy any existing borders.
			} else if (len > 1) {
				const unselected = this.deselectAllExceptThisContainer(index);
				this.destroyBorder(unselected);
				this.drawBorder();
				return;
			}

			// Draw the border of the currently selected element.
			this.drawBorder();

		// If there is more than one children of the wrappedContainer,
		//  add all of its children to the viewport + remove them and destroy its border, then draw the border of the clicked element.
		} else if(this._wrappedContainer.children.length > 0) {
			const index = this._selectedContainers.findIndex(el => el === container);
			if(index === -1) return;

			this._wrappedContainer.destroyBorder();
			this._wrappedContainer.restoreOriginChildren();
			this._wrappedContainer.removeChildren();
			this.deselectAllExceptThisContainer(index);
			this.drawBorder();
		}
	}

	public deselectAllExceptThisContainer(index: number) {
		const selected: Array<Container> = [];
		const unselected: Array<Container> = [];

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

	public destroyBorder(container: Array<Container>) {
		for(let n = 0; n < container.length; n++) {
			container[n].destroyBorder();
		}
	}

	public drawBorder() {
		for(let n = 0; n < this._selectedContainers.length; n++) {
			this._selectedContainers[n].drawBorder();
		}
	}

	public wrapWithTemporaryParent() {
		this._wrappedContainer.addChild(...this._selectedContainers);
		this._wrappedContainer.drawBorder();
		this._scene.viewport.addChild(this._wrappedContainer);
	}







	// Everything below is work in progress









	public attachPlugins(container: Container) {
		this._dragPlugin.attach(container);
		this._selectPlugin.attach(container);
		this._resizePlugin.attach(container);
		this._downloadPlugin.attach(container);
	}

	public detachPlugins(container: Container) {
		this._dragPlugin.detach(container);
		this._selectPlugin.detach(container);
		this._resizePlugin.detach(container);
		this._downloadPlugin.detach(container);
	}

	handleEvent(event) {

	}

	handleSelect(event: KeyboardEvent) {
		const clickedContainer = this._selectPlugin.getContainerUnderMouse(this._scene.stage);
		if (clickedContainer) {
			if (event.shiftKey && this._selectedContainers.length > 0) {
				// shift-click to add to selection
				// this.selectContainer(clickedContainer);
			} else {
				// regular click to select only the clicked container
				// this.deselectAllContainers();
				// this.selectContainer(clickedContainer);
			}
		} else {
			// click outside any container to deselect all
			// this.deselectAllContainers();
		}
	}

	handleDrag(event: any) {
		for(let c = 0; c < this._selectedContainers.length; c++) {
			this._resizePlugin.handleResize(this._selectedContainers[c]);
		}
	}

	handleResize(event: any) {
		for(let c = 0; c < this._selectedContainers.length; c++) {
			this._resizePlugin.handleResize(this._selectedContainers[c]);
		}
	}

	handleDownload(event: any) {
		// Pause, parce que le download je ne suis pas certain qu'il puisse target un container.
	}
}