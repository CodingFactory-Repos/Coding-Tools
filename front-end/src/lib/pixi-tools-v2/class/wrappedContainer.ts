import { FederatedPointerEvent } from 'pixi.js';
import { ContainerManager } from './containerManager';
import { FramedContainer } from './framedContainer';
import { Rectangle } from '../model/template';
import { ViewportUI } from '../viewportUI';

import { BoundsContainer, ModelGraphics } from '../types/pixi-class';
import type { CanvasContainer } from '../types/pixi-aliases';

export class WrappedContainer extends BoundsContainer {
	protected readonly viewport: ViewportUI;
	protected readonly manager: ContainerManager;
	protected awaitDblClick = false;
	protected timeout: NodeJS.Timeout = null;
	public absoluteChildren: Array<CanvasContainer>;
	public wrappedBox: Rectangle = null;
	public readonly typeId: string;

	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;

	constructor(manager: ContainerManager, viewport: ViewportUI) {
		super();

		this.typeId = 'wrap';
		this.cursor = 'pointer';
		this.interactive = true;
		this.viewport = viewport;
		this.manager = manager;

		this.on('pointerdown', this.onPointerDown);
	}

	public restoreStateContext() {
		clearTimeout(this.timeout);
		this.timeout = null;
		this.awaitDblClick = false;
		this.toggleChildrenInteractive(true);
		this.removeChildren();
		this.wrappedBox.destroy();
		this.wrappedBox = null;
		this.absoluteChildren = [];
		this.viewport.removeChild(this);
		this.removeAllListeners('pointerup');
	}

	public toggleChildrenInteractive = (interactive: boolean) => {
		for (let n = 0; n < this.absoluteChildren.length; n++) {
			const child = this.absoluteChildren[n];
			child.interactive = interactive;

			if (child instanceof FramedContainer) {
				child.mainContainer.children.forEach((ctn) => {
					ctn.interactive = interactive;
					ctn.children.forEach((graph) => (graph.interactive = interactive));
				});
			} else {
				child.children.forEach((graph) => {
					graph.interactive = interactive;
				});
			}
		}
	};

	protected updateAbsoluteBounds() {
		let minX = Number.MAX_SAFE_INTEGER;
		let minY = Number.MAX_SAFE_INTEGER;
		let maxX = Number.MIN_SAFE_INTEGER;
		let maxY = Number.MIN_SAFE_INTEGER;

		for (let n = 0; n < this.absoluteChildren.length; n++) {
			const geometry = this.absoluteChildren[n].getGeometry();
			if (geometry === null) continue;

			const { x, y, width, height } = geometry;

			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x + width > maxX) maxX = x + width;
			if (y + height > maxY) maxY = y + height;
		}

		this.absMinX = minX;
		this.absMinY = minY;
		this.absMaxX = maxX;
		this.absMaxY = maxY;
	}

	public getGeometry() {
		this.updateAbsoluteBounds();
		return {
			x: this.absMinX,
			y: this.absMinY,
			width: this.absMaxX - this.absMinX,
			height: this.absMaxY - this.absMinY,
		};
	}

	public getGraphicChildren() {
		const graphics: Array<ModelGraphics | Array<ModelGraphics>> = [];

		for (let n = 0; n < this.absoluteChildren.length; n++) {
			graphics.push(this.absoluteChildren[n].getGraphicChildren());
		}

		if (this.wrappedBox) {
			graphics.push(this.wrappedBox);
		}

		return graphics.flat();
	}

	public createWrappedBox(childs: Array<CanvasContainer>) {
		this.removeChildren();
		this.absoluteChildren = childs;

		const geometry = this.getGeometry();
		this.wrappedBox = new Rectangle({
			uuid: null,
			typeId: 'rectangle',
			bounds: geometry,
			properties: {
				color: 0xff00ff,
				cursor: 'pointer',
				interactive: true,
				alpha: 0,
			},
		});
		this.wrappedBox.cursor = 'pointer';
		this.wrappedBox.interactive = true;
		this.addChildAt(this.wrappedBox, 0);
		this.toggleChildrenInteractive(false);
		this.awaitDblClick = false;
		this.timeout = null;
	}

	protected onPointerDown(e: FederatedPointerEvent) {
		if (e.forced) return;
		if (!this.awaitDblClick) {
			if (this.timeout) clearTimeout(this.timeout);

			this.toggleChildrenInteractive(true);
			this.viewport.setChildIndex(this, 1);
			this.timeout = null;
			this.awaitDblClick = true;

			this.timeout = setTimeout(() => {
				this.toggleChildrenInteractive(false);
				this.viewport.setChildIndex(this, this.viewport.children.length - 9);
				this.awaitDblClick = false;
				this.timeout = null;
			}, 300);
		} else {
			clearTimeout(this.timeout);
			this.manager.deselectAll();
			this.manager.detachPlugins();
			this.timeout = null;
			this.awaitDblClick = false;
		}
	}
}
