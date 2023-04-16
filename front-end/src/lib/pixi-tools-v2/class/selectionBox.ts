import { Drag } from 'pixi-viewport';
import { Graphics, FederatedPointerEvent, Point } from 'pixi.js';
import { GenericContainer } from './genericContainer';
import { FramedContainer } from './framedContainer';
import { ViewportUI } from '../viewportUI';

import type { CanvasContainer } from '../types/pixi-aliases';

export class SelectionBox extends Graphics {
	protected readonly nativeDragPlugin: Drag;
	protected readonly viewport: ViewportUI;
	protected readonly box: Graphics;
	private _startPos: Point;

	constructor(viewport: ViewportUI) {
		super();

		this.visible = false;
		this.box = new Graphics();
		this.box.alpha = 0.2;
		this.box.visible = false;
		this.addChild(this.box);

		this.viewport = viewport;
		this.viewport.on('pointerdown', this.startSelection);
		this.nativeDragPlugin = this.viewport.plugins.get('drag');
		this.viewport.addChild(this);
	}

	private startSelection = (e: FederatedPointerEvent) => {
		if (e.originalEvent.shiftKey) {
			this._startPos = this.viewport.toWorld(e.global.clone());

			this.clear();
			this.box.clear();
			this.visible = true;
			this.box.visible = true;

			this.viewport.on('pointermove', this.updateSelection);
			this.viewport.on('pointerup', this.endSelection);
		}
	};

	private updateSelection = (e: FederatedPointerEvent) => {
		if (!this.visible) return;
		if (!this.nativeDragPlugin.paused) {
			this.nativeDragPlugin.pause();
		}

		this.viewport.selectionBoxActive = true;
		const scale = this.viewport.scaled;
		const point = this.viewport.toWorld(e.global.clone());
		const startX = Math.min(point.x, this._startPos.x);
		const startY = Math.min(point.y, this._startPos.y);
		const endX = Math.max(point.x, this._startPos.x);
		const endY = Math.max(point.y, this._startPos.y);
		const width = endX - startX;
		const height = endY - startY;

		this.clear();
		this.lineStyle(2 / scale, 0x0c8ce9);
		this.drawRect(startX, startY, width, height);
		this.box.clear();
		this.box.beginFill(0x0c8ce9);
		this.box.drawRect(startX, startY, width, height);
		this.box.endFill();
	};

	private endSelection = () => {
		this.visible = false;
		this.box.visible = false;
		this.nativeDragPlugin.resume();
		this.viewport.off('pointermove', this.updateSelection);
		this.viewport.off('pointerup', this.endSelection);

		const selectionBounds = this.getBounds();

		const selectedChildren: Array<CanvasContainer> = [];
		for (let n = 0; n < this.viewport.children.length; n++) {
			const child = this.viewport.children[n];
			if (!child.visible) continue;

			if (child instanceof GenericContainer || child instanceof FramedContainer) {
				if (child.getBounds().intersects(selectionBounds)) {
					selectedChildren.push(this.viewport.children[n]);
				}
			}
		}

		for (let n = 0; n < selectedChildren.length; n++) {
			this.viewport.manager.selectContainer(selectedChildren[n], true);
		}

		this.viewport.selectionBoxActive = false;
		this.clear();
		this.box.clear();
	};

	public destroy() {
		super.destroy();
		this.viewport.off('pointerdown', this.startSelection);
		this.viewport.off('pointermove', this.updateSelection);
		this.viewport.off('pointerup', this.endSelection);
		this.viewport.removeChild(this);
	}
}
