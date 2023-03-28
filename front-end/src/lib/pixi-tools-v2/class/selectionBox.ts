
import { Graphics, FederatedPointerEvent, Point, Container } from 'pixi.js';
import { Drag, Viewport } from 'pixi-viewport';
import { Scene } from '@/lib/pixi-tools-v2/scene';
import { ContainerManager } from './containerManager';
import { CanvasContainer } from '../types/pixi-container-options';
import { GenericContainer } from './genericContainer';
import { FramedContainer } from './framedContainer';

export class SelectionBox extends Graphics {
	private _startPos: Point;
	private _viewport: Viewport;
	private _box: Graphics;
	private _dragPlugin: Drag;
	private _manager: ContainerManager;

	constructor(scene: Scene) {
		super();

		this.visible = false;
		this._box = new Graphics();
		this._box.alpha = 0.2;
		this._box.visible = false;
		this.addChild(this._box);
		
		this._manager = scene.manager;
		this._viewport = scene.viewport;
		this._viewport.on('pointerdown', this.startSelection);
		this._dragPlugin = this._viewport.plugins.get("drag");
		this._viewport.addChild(this);
	}

	public startSelection = (e: FederatedPointerEvent) => {
		if(e.originalEvent.shiftKey) {
			this._startPos = this._viewport.toWorld(e.global.clone());

			this.clear();
			this._box.clear();
			this.visible = true;
			this._box.visible = true;

			this._viewport.on('pointermove', this.updateSelection);
			this._viewport.on('pointerup', this.endSelection);
		}
	}

	public updateSelection = (e: FederatedPointerEvent) => {
		if (!this.visible) return;
		if (!this._dragPlugin.paused) {
			this._dragPlugin.pause();
		}

		const scale = this._viewport.scaled;
		const point = this._viewport.toWorld(e.global.clone());
		const startX = Math.min(point.x, this._startPos.x);
		const startY = Math.min(point.y, this._startPos.y);
		const endX = Math.max(point.x, this._startPos.x);
		const endY = Math.max(point.y, this._startPos.y);
		const width = endX - startX;
		const height = endY - startY;

		this.clear();
		this.lineStyle(2 / scale, 0x0c8ce9);
		this.drawRect(startX, startY, width, height);
		this._box.clear();
		this._box.beginFill(0x0c8ce9);
		this._box.drawRect(startX, startY, width, height);
		this._box.endFill();
	}

	public endSelection = () => {
		this.visible = false;
		this._box.visible = false;
		this._dragPlugin.resume();
		this._viewport.off('pointermove', this.updateSelection);
		this._viewport.off('pointerup', this.endSelection);

		const selectionBounds = this.getBounds();

		const selectedChildren: Array<CanvasContainer> = [];
		for(let n = 0; n < this._viewport.children.length; n++) {
			const child = this._viewport.children[n];

			if(child instanceof GenericContainer || child instanceof FramedContainer) {
				if(child.getBounds().intersects(selectionBounds)) {
					selectedChildren.push(this._viewport.children[n]);
				}
			}
		}

		for(let n = 0; n < selectedChildren.length; n++) {
			this._manager.selectContainer(selectedChildren[n], true);
		}
	}

	public destroy() {
		super.destroy();
		this._viewport.off('pointerdown', this.startSelection);
		this._viewport.off('pointermove', this.updateSelection);
		this._viewport.off('pointerup', this.endSelection);
		this._viewport.removeChild(this);
	}
}