import { EventBoundary, FederatedPointerEvent, Point } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { WrappedContainer } from '../class/wrappedContainer';
import { ViewportUI } from '../viewportUI';

import type { InitialGraphicState } from '../types/pixi-container';
import type { CanvasContainer, PluginContainer } from '../types/pixi-aliases';

type FrameIntersect = {
	frame: FramedContainer;
	childs: Array<CanvasContainer>;
};

export class DragPlugin {
	protected readonly viewport: ViewportUI;
	protected readonly initialGraphicsState: Array<InitialGraphicState> = [];
	protected readonly endHandler: (e: FederatedPointerEvent) => void;
	protected container: PluginContainer = null;
	protected initialCursorPosition: Point = null;
	protected isDragging = false;
	protected frameIntersect: Array<FrameIntersect> = [];
	protected unconstraints: Array<CanvasContainer> = [];
	protected contextRemoved = false;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
		this.endHandler = this._endDragging.bind(this);
	}

	public attach(container: PluginContainer) {
		this.container = container;
		this.container.on('pointerdown', this._initDragging);

		if (!this.viewport.selectionBoxActive) {
			const eventBoundary = new EventBoundary(this.container);
			const fakeEvent = new FederatedPointerEvent(eventBoundary);
			fakeEvent.forced = true;
			fakeEvent.global = this.viewport.mouse;
			this.container.emit('pointerdown', fakeEvent);
		}
	}

	public detach() {
		if (this.isDragging) return;
		if (this.container) {
			this.container.off('pointerdown', this._initDragging);
			this._endDragging(null);
		}
		this.frameIntersect = [];
		this.unconstraints = [];
		this.initialCursorPosition = null;
		this.contextRemoved = false;
		this.container = null;
	}

	private _initDragging = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		const graphics = this.container.getGraphicChildren();
		for (const element of graphics) {
			element.cursor = 'grabbing';
			this.initialGraphicsState.push({
				child: element,
				width: element.width,
				height: element.height,
				x: element.x,
				y: element.y,
			});
		}

		this.frameIntersect = [];
		this.initialCursorPosition = this.viewport.toWorld(e.global.clone());
		this.viewport.on('pointermove', this._updateDragging);
		this.viewport.on('pointerup', this.endHandler);
		this.container.on('pointermove', this._updateDragging);
		this.container.on('pointerup', this.endHandler);

		this.viewport.cursor = 'grabbing';
		this.container.cursor = 'grabbing';
	};

	private _updateDragging = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		const frames = this.viewport.children.filter(
			(ctn) => ctn.visible && ctn instanceof FramedContainer,
		) as Array<FramedContainer>;

		try {
			// Prevent an error when mouse move event and deletion event at the same time
			this.isDragging = true;
			const cursorPosition = this.viewport.toWorld(e.global.clone());
			const dx = cursorPosition.x - this.initialCursorPosition.x;
			const dy = cursorPosition.y - this.initialCursorPosition.y;

			for (const element of this.initialGraphicsState) {
				const newX = element.x + dx;
				const nexY = element.y + dy;
				element.child.position.set(newX, nexY);

				if (element.child.typeId !== 'rectangle' && element.child.typeId !== 'circle')
					continue;

				const parent = element.child.parent as CanvasContainer;
				const childBounds = element.child.getBounds();
				const centerX = childBounds.x + childBounds.width / 2;
				const centerY = childBounds.y + childBounds.height / 2;

				for (let i = 0; i < frames.length; i++) {
					// Does the child intersect the frame
					if (frames[i].frameBoxBounds.contains(centerX, centerY)) {
						parent.alpha = 0.7;

						// If the parent does exist in the unconstraints array, we remove it.
						const genericIndex = this.unconstraints.indexOf(parent);
						if (genericIndex !== -1) this.unconstraints.splice(genericIndex, 1);

						// Try to find if the frame was already added in the intersect array.
						const frameIndex = this.frameIntersect.findIndex((el) => el.frame === frames[i]);
						if (frameIndex === -1) {
							this.frameIntersect.push({
								frame: frames[i],
								childs: [parent],
							});
						} else {
							// If the frame was added, we check if the parent of the child was already added to the childs array
							const exist = this.frameIntersect[frameIndex].childs.indexOf(parent);
							if (exist === -1) {
								this.frameIntersect[frameIndex].childs.push(parent);
							}
						}
						break;
					} else {
						parent.alpha = 1;

						// If the parent does not exist in the unconstraints array, we push it.
						const genericIndex = this.unconstraints.indexOf(parent);
						if (genericIndex === -1) this.unconstraints.push(parent);

						// Try to find if the frame was already added in the intersect array.
						const frameIndex = this.frameIntersect.findIndex((el) => el.frame === frames[i]);
						if (frameIndex !== -1) {

							// If the frame was added, we check if the parent of the child was already added to the childs array
							const exist = this.frameIntersect[frameIndex].childs.indexOf(parent);
							if (exist !== -1) {
								this.frameIntersect[frameIndex].childs.splice(exist, 1);

								// If the frameIntersect index has no child, we remove it.
								if (this.frameIntersect[frameIndex].childs.length === 0) {
									this.frameIntersect.splice(frameIndex, 1);
								}
							}
						}
					}
				}
			}

			if (this.container instanceof FramedContainer) {
				this.container.emit('moved', null);
			}

			if (this.container instanceof WrappedContainer) {
				for (const element of this.container.absoluteChildren) {
					if (element instanceof FramedContainer) {
						element.emit('moved', null);
					}
				}
			}

			if (this.viewport.socketPlugin) {
				const containers = this.container instanceof WrappedContainer
					? this.container.absoluteChildren
					: [this.container];

				for(const container of containers) {
					container.getGeometry();
					this.viewport.socketPlugin.emit(
						'ws-element-updated',
						container.uuid,
						container.serializeBounds(),
					);
				}
			}

			const geometry = this.container.getGeometry();
			this.viewport.destroyBorder();
			this.viewport.createBorder({ ...geometry, scale: this.viewport.scaled });
			this.viewport.updateResizeHitAreas(geometry);
			this.viewport.updateResizeHandles(geometry, false);
		} catch (err) {
			if (err instanceof Error) {
				console.error('Unexpected error during drag :', err.message);
			}

			this._removeViewportDragEvent();
		}
	};

	private _endDragging(e: FederatedPointerEvent) {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		try {
			// Prevent an error when mouse up event and deletion event at the same time
			this.container.off('pointerup', this.endHandler);
			this.container.off('pointermove', this._updateDragging);
			this._removeViewportDragEvent();

			this.initialGraphicsState.forEach((el) => {
				el.child.cursor = 'pointer';
			});

			this.frameIntersect.forEach((intersect) => {
				intersect.childs.forEach((child) => {
					intersect.frame.addNestedChild(child, intersect.frame.frameNumber, false);
				});
			});

			this.unconstraints.forEach((ctn) => {
				if(ctn.isAttachedToFrame) {
					const frame = ctn.parent.parent as FramedContainer;
					frame.removeNestedChild(ctn, this.viewport.children.length - 9, false);
				}
			});

			this.frameIntersect = [];
			this.unconstraints = [];
			this.contextRemoved = false;
			this.initialGraphicsState.length = 0;
			this.initialCursorPosition = null;
			this.container.cursor = 'pointer';
			this.isDragging = false;
		} catch (err) {
			if (err instanceof Error) {
				console.error('Unexpected error during end drag :', err.message);
			}
		}
	}

	private _removeViewportDragEvent = () => {
		this.viewport.off('pointermove', this._updateDragging);
		this.viewport.off('pointerup', this.endHandler);
		this.viewport.cursor = 'default';
		this.isDragging = false;
	};
}
