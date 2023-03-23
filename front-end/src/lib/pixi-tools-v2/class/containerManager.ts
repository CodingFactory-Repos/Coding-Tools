import { Container, DisplayObject } from 'pixi.js';
import { Scene } from "@/lib/pixi-tools-v2/scene";

export class ContainerManager {
	private _scene: Scene;
	private _selectedContainers: Array<DisplayObject>;
	private _wrapperContainer: DisplayObject;
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

	public selectContainer(container: DisplayObject) {
		if (!this._selectedContainers.includes(container)) {
			this._selectedContainers.push(container);
			this.attachPlugins(container);
		}
	}

	public deselectContainer(container: DisplayObject) {
		const index = this._selectedContainers.indexOf(container);
		if (index !== -1) {
			this._selectedContainers.splice(index, 1);
			this.detachPlugins(container);
		}
	}

	public attachPlugins(container: DisplayObject) {
		this._dragPlugin.attach(container);
		this._selectPlugin.attach(container);
		this._resizePlugin.attach(container);
		this._downloadPlugin.attach(container);
	}

	public detachPlugins(container: DisplayObject) {
		this._dragPlugin.detach(container);
		this._selectPlugin.detach(container);
		this._resizePlugin.detach(container);
		this._downloadPlugin.detach(container);
	}

	handleEvent(event) {

	}

	handleSelect(event) {
		
	}

	handleDrag(event) {

	}

	handleResize(event: any) {
		for(let c = 0; c < this._selectedContainers.length; c++) {
			this._resizePlugin.handleResize(this._selectedContainers[c]);
		}
	}

	handleDownload(event) {

	}
}