import { Container, DisplayObject } from 'pixi.js';
import { Scene } from "@/lib/pixi-tools-v2/scene";

export class ContainerManager {
	private _scene: Scene;
	private _selectedContainers: Array<Container>;
	private _wrapperContainer: Container;
	private _dragPlugin: any;
	private _selectPlugin: any;
	private _resizePlugin: any;
	private _downloadPlugin: any;

	constructor(scene: Scene) {
		this._scene = scene;
		this._selectedContainers = [];
		this._wrapperContainer = new Container();
		this._dragPlugin = null;
		this._selectPlugin = null;
		this._resizePlugin = null;
		this._downloadPlugin = null;
	}

	public selectContainer(container: Container) {
		if (!this._selectedContainers.includes(container)) {
			this._selectedContainers.push(container);
		}

		if (this._selectedContainers.length > 1) {
			this.createTemporaryParent();
		} else {
			this.attachPlugins(container);
			container.activePlugin = true;
		}
	}

	private hasChild(container: Container) {
		return this._scene.viewport.children.indexOf(container) !== -1;
	}

	public createTemporaryParent() {
		for(let n = 0; n < this._selectedContainers.length; n++) {
			if(this._selectedContainers[n].activePlugin) {
				this.detachPlugins(this._selectedContainers[n]);
			}

			if(this.hasChild(this._selectedContainers[n])) {
				this._scene.viewport.removeChild(this._selectedContainers[n]);
				this._wrapperContainer.addChild(this._selectedContainers[n]);
			}
		}

		if(!this.hasChild(this._wrapperContainer)) {
			this._scene.viewport.addChild(this._wrapperContainer);
		}
	}

	public deselectContainer(container: Container) {
		const index = this._selectedContainers.indexOf(container);
		if (index !== -1) {
			this._selectedContainers.splice(index, 1);
			this.detachPlugins(container);
		}
	}

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
				this.selectContainer(clickedContainer);
			} else {
				// regular click to select only the clicked container
				this.deselectAllContainers();
				this.selectContainer(clickedContainer);
			}
		} else {
			// click outside any container to deselect all
			this.deselectAllContainers();
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