import { Graphics } from "pixi.js";
import { PluginContainer } from "../types/pixi-container-options";
import { Viewport } from 'pixi-viewport';
import { FramedContainer } from "../class/framedContainer";

export class ResizePlugin {
	private _container: PluginContainer;
	private _handles: Array<Graphics> = [];
	private _viewport: Viewport;

	constructor(viewport: Viewport) {
		this._viewport = viewport;
	}

	public attach(container: PluginContainer) {
		this._container = container;
		this._createResizeHandles();
	}

	public detach() {
		this._container = null;
		this._destroyHandles();
	}
	
	private _createResizeHandles() {
		const scale = this._viewport.scaled;
		const size = 5 / scale;
		const { right, left, top, bottom } = this._container instanceof FramedContainer
			? this._container.getFrameLocalBounds()
			: this._container.getLocalBounds();

		const positions = [
			{ x: (left + size / 4), y: (top + size / 4)},
			{ x: (right - size / 4), y: (top + size / 4)},
			{ x: (right - size / 4), y: (bottom - size / 4)},
			{ x: (left + size / 4), y: (bottom - size / 4)},
		]

		for (let n = 0; n < positions.length; n++) {
			const { x, y } = positions[n];

			const handle = new Graphics();
			handle.lineStyle(1 / scale, 0x0c8ce9)
			handle.beginFill(0xffffff);
			handle.drawCircle(0, 0, size);
			handle.endFill();
			handle.interactive = true;
			handle.cursor = "pointer";
			handle.position.set(x, y);
			handle.on('pointerdown', (event) => {
				event.stopPropagation();
				console.log("hey");
			});
			this._handles.push(handle);
			this._container.addChild(handle);
		}
	}

	private _destroyHandles() {
		for(let n = 0; n < this._handles.length; n++) {
			this._handles[n].destroy();
		}

		this._handles = [];
	}
}