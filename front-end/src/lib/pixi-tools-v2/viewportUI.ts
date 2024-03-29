import { IViewportOptions, Viewport } from 'pixi-viewport';
import {
	EventBoundary,
	FederatedPointerEvent,
	ICanvas,
	IRenderer,
	Point,
	TextStyleAlign,
	TextStyleFontStyle,
	TextStyleFontWeight,
} from 'pixi.js';
import { Scene } from './scene';
import { ContainerManager } from './class/containerManager';
import { ViewportZoomPlugin } from './plugins/viewportZoomPlugin';
import { Border, Handle, HitArea, Grid } from './model/template-ui';
import { BezierCurveHandle, BezierHandle, ResizeHandle } from './types/pixi-enums';

import type { CanvasContainer, Stage } from './types/pixi-aliases';
import type { HandleOptions, HitAreaOptions, GraphicUIProperties } from './types/pixi-ui';
import { reactive, shallowReactive } from 'vue';
import { FramedContainer } from './class/framedContainer';
import { CanvasSocketOptions, ViewportSocketPlugin } from './plugins/viewportSocketPlugin';
import { ElementPosition, ElementSize } from './types/pixi-container';
import { GenericContainer } from './class/genericContainer';
import { decimToHex } from './utils/colorsConvertor';
import { dragAttachedLines } from './utils/dragAttachedLines';
import { TextContainer } from './class/textContainer';

export interface TextEditorOptions {
	text: string;
	fontSize: number | string;
	fontWeight?: TextStyleFontWeight;
	fontStyle?: TextStyleFontStyle;
	fontFamily?: string | string[];
	fontPadding?: number;
	fontAlign?: TextStyleAlign;
	wordWrap?: boolean;
	wordWrapWidth?: number;
	breakWords?: boolean;
	color: number;
	x: number;
	y: number;
	width: number;
	height: number;
	padding: number;
	containerized: boolean;
	lineHeight: number;
}

export interface ViewportBounds {
	x: number;
	y: number;
	mouseX: number;
	mouseY: number;
	scaleX: number;
	scaleY: number;
}

export class ViewportUI extends Viewport {
	public readonly scene: Scene;
	private _isHiddenUI = false;
	public readonly renderer: IRenderer<ICanvas>;
	public readonly zoomPlugin: ViewportZoomPlugin;
	public readonly socketPlugin: ViewportSocketPlugin;
	public readonly manager: ContainerManager;
	public readonly bezierCurveHandles: Array<Handle> = [];
	public readonly resizeHandles: Array<Handle> = [];
	public readonly lineHandles: Array<Handle> = [];
	public readonly bezierHandles: Array<Handle> = [];
	public readonly resizeHitAreas: Array<HitArea> = [];
	public readonly onScreenChildren: Array<CanvasContainer> = [];
	public readonly parent: Stage;
	public readonly grid: Grid;
	public border: Border = null;
	public cursor: CSSStyleProperty.Cursor;
	public mouse: Point;
	public selectionBoxActive = false;
	public activeFrameNumber = null;
	public textEditor: HTMLDivElement;

	public readonly activeFrames: Array<number> = reactive([]);
	public readonly childFrames: Array<FramedContainer> = shallowReactive([]);
	public viewportBounds = reactive<Partial<ViewportBounds>>({});

	constructor(
		scene: Scene,
		options: IViewportOptions,
		isDark: boolean,
		socketOptions?: CanvasSocketOptions,
	) {
		super(options);

		this.drag().pinch({ percent: 2 }).wheel().decelerate();
		this.scene = scene;
		this.renderer = scene.renderer;

		this.manager = new ContainerManager(this);
		this.zoomPlugin = new ViewportZoomPlugin(this, this.manager);
		if (socketOptions) {
			this.socketPlugin = new ViewportSocketPlugin(this, socketOptions);
		}

		const canvasWrapper = document.getElementById('viewport');
		this.textEditor = document.createElement('div');
		this.textEditor.contentEditable = 'true';
		this.textEditor.setAttribute('data-placeholder', 'Type something if you want to add some text');
		this.textEditor.classList.add('textEditor');
		this.textEditor.addEventListener('input', this.updateTextAreaBounds.bind(this));
		canvasWrapper.appendChild(this.textEditor);

		this.grid = new Grid({ color: isDark ? 0x27282d : 0xd9d9d9 });
		this.addChildAt(this.grid, 0);
		this.viewportBounds.x = this.x;
		this.viewportBounds.y = this.y;

		window.addEventListener('resize', this._onWindowResized.bind(this));
		this.on('moved', this._onViewportMoved);
		this.on('zoomed', this._onViewportZoomed);
		this.on('zoomed-end', this.getVisibleChildren);
		this.on('pointerdown', this._onViewportUnselect);
		this.on('pointermove', (e: FederatedPointerEvent) => {
			this.mouse = e.global;
			const worldPos = this.toWorld(e.global);
			this.viewportBounds.mouseX = worldPos.x;
			this.viewportBounds.mouseY = worldPos.y;
		});

		this.on('childAdded', (child: CanvasContainer) => {
			if (child instanceof FramedContainer) {
				this.activeFrames.push(child.frameNumber);
				this.childFrames.push(child);
			}

			if (this.socketPlugin) {
				this.socketPlugin.trackElementByUUID(child);
			}
		});

		this.on('childRemoved', (child: CanvasContainer) => {
			if (child instanceof FramedContainer) {
				const index = this.activeFrames.indexOf(child.frameNumber);
				if (index !== -1) {
					this.activeFrames.splice(index, 1);
					this.childFrames.splice(index, 1);
				}
			}

			if (this.socketPlugin) {
				this.socketPlugin.pruneDestroyedElements();
			}
		});
	}

	public updateTextAreaBounds(e: Event) {
		const target = e.target as HTMLDivElement;
		const text = target.innerText;
		const unicode = text.charCodeAt(0);

		if (text !== undefined && text !== '' && unicode !== 10) {
			this.textEditor.classList.remove('blank');
		} else if (text.trim().length === 0) {
			this.textEditor.classList.add('blank');
		}

		const size = { width: this.textEditor.offsetWidth, height: this.textEditor.offsetHeight };
		this.updateUI(size);
		dragAttachedLines(this.manager._selectedContainers[0], this.socketPlugin, size, true);
	}

	public startTextEditor(options: Partial<TextEditorOptions>) {
		const points = this.toScreen(options.x, options.y);
		this.textEditor.style.color = decimToHex(options.color);
		this.textEditor.style.left = `${points.x}px`;
		this.textEditor.style.top = `${points.y}px`;
		this.textEditor.style.fontSize = `${options.fontSize}px`;
		this.textEditor.style.display = 'block';
		this.textEditor.style.padding = `${options.padding}px`;
		this.textEditor.style.transform = `scale(${this.scaled})`;

		//! This is the best solution i got since increasing the graphical size increase the lineHeight;
		this.textEditor.style.lineHeight = `${Math.floor((options.fontSize as number) * 1.2)}px`;

		//! This doesn't match exactly between graphic/css;
		this.textEditor.style.fontWeight = options.fontWeight === '300' ? 'normal' : options.fontWeight;
		this.textEditor.style.fontStyle = options.fontStyle;
		this.textEditor.style.textAlign = options.fontAlign;

		if (typeof options.fontFamily !== 'string') {
			this.textEditor.style.fontFamily = options.fontFamily.join(', ');
		} else {
			this.textEditor.style.fontFamily = options.fontFamily;
		}

		if (options.text !== undefined && options.text !== '') {
			const perLine = options.text
				.split('\n')
				.map((txt) => `<div>${txt.length > 0 ? txt : '<br>'}</div>`)
				.join('');
			this.textEditor.innerHTML = perLine;
			this.textEditor.classList.remove('blank');
		} else {
			this.textEditor.classList.add('blank');
		}

		if (options.containerized) {
			this.textEditor.style.maxWidth = `${options.width}px`;
			this.textEditor.style.maxHeight = `${options.height}px`;
		} else {
			this.textEditor.style.width = `fit-content`;
			this.textEditor.style.height = `fit-content`;
		}

		if (options.wordWrap && options.breakWords) {
			this.textEditor.style.wordBreak = 'break-word';
			this.textEditor.style.maxWidth = `${options.wordWrapWidth}px`;
			this.textEditor.style.width = '100%';
		} else {
			this.textEditor.style.maxWidth = 'unset';
			this.textEditor.style.wordBreak = 'unset';
		}

		this.textEditor.focus();
		this.textEditor.click();
		const size = { width: this.textEditor.scrollWidth, height: this.textEditor.scrollHeight };
		this.updateUI(size);
	}

	public endTextEditor() {
		this.textEditor.style.display = 'none';
		this.textEditor.blur();
	}

	public changeGridTheme(isDark: boolean) {
		this.grid.color = isDark ? 0x27282d : 0xd9d9d9;
		this.drawGrid();
	}

	public offWindowResized() {
		window.removeEventListener('resize', this._onWindowResized);
	}

	private _onWindowResized() {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight - this.scene.heightOffset;

		this.scene.renderer.resize(newWidth, newHeight);
		this.screenWidth = newWidth;
		this.screenHeight = newHeight;
		this.worldWidth = newWidth;
		this.worldHeight = newHeight;

		this.drawGrid();
	}

	private _onViewportMoved() {
		this.viewportBounds.x = this.x;
		this.viewportBounds.y = this.y;
		this.drawGrid();
	}

	private _onViewportZoomed() {
		this.zoomPlugin.updateZoomScale();

		if (this.manager.isActive) {
			let size = this.manager.getSelectedSize();
			const viewportWidth = this.worldWidth;
			const scaledWidth = size.width * this.scaled;

			if (scaledWidth < viewportWidth * 0.025) {
				if (!this._isHiddenUI) {
					this._isHiddenUI = true;
					this.toggleUIVisibilty(false);
				}
			} else if (this._isHiddenUI) {
				this._isHiddenUI = false;
				this.toggleUIVisibilty(true);
			}

			if (this.textEditor.style.display === 'block') {
				const points = this.toScreen(size.x, size.y);
				this.textEditor.style.transform = `scale(${this.scaled})`;
				this.textEditor.style.left = `${points.x}px`;
				this.textEditor.style.top = `${points.y}px`;
				size = { width: this.textEditor.scrollWidth, height: this.textEditor.scrollHeight };
			}

			this.updateUI(size);
		}

		this.viewportBounds.x = this.x;
		this.viewportBounds.y = this.y;
		this.viewportBounds.scaleX = this.scale.x;
		this.viewportBounds.scaleY = this.scale.y;
	}

	private updateUI(size: ElementSize) {
		if (this.border) {
			this.border.draw({
				...size,
				x: this.border.x,
				y: this.border.y,
				scale: this.scaled,
			});
		}

		if (!this._isHiddenUI) {
			if (this.resizeHandles?.length > 0) {
				this.updateResizeHandles(
					{
						...size,
						x: this.border.x,
						y: this.border.y,
					},
					true,
				);
			}

			if (this.bezierHandles?.length > 0) {
				this.updateBezierHandles(
					{
						...size,
						x: this.border.x,
						y: this.border.y,
					},
					true,
				);
			}

			if (this.bezierCurveHandles?.length > 0) {
				this.updateBezierCurveHandle(
					{ x: this.bezierCurveHandles[0].x, y: this.bezierCurveHandles[0].y },
					{ x: this.bezierCurveHandles[1].x, y: this.bezierCurveHandles[1].y },
					true,
				);
			}

			if (this.resizeHitAreas?.length > 0) {
				this.updateResizeHitAreas({
					...size,
					x: this.border.x,
					y: this.border.y,
				});
			}
		}
	}

	public getVisibleChildren() {
		if (this.manager.isActive) {
			this.onScreenChildren.length = 0;
			const visibleBounds = this.getVisibleBounds();

			for (const element of this.children) {
				if (
					element instanceof GenericContainer ||
					element instanceof FramedContainer ||
					element instanceof TextContainer
				) {
					if (element.getLocalBounds().intersects(visibleBounds)) {
						this.onScreenChildren.push(element);
					}
				}
			}
		}
	}

	private _onViewportUnselect(e: FederatedPointerEvent) {
		const { x, y } = e.global;
		const eventBoundary = new EventBoundary(this);

		if (eventBoundary.hitTest(x, y) === this && this.manager.isActive) {
			e.stopPropagation();
			this.manager.deselectAll();
			this.manager.detachPlugins();
		}
	}

	public toggleHidding(hide: boolean, frameNumber: number = null) {
		this.children.forEach((child) => {
			if (frameNumber && child.tabNumberContext === frameNumber) {
				child.visible = true;
			} else {
				child.visible = hide;
			}
		});
	}

	public drawGrid() {
		if (this.scaled > 5) {
			this.grid.draw({
				width: this.worldScreenWidth,
				height: this.worldScreenHeight,
				scale: this.scaled,
				left: this.left,
				top: this.top,
			});
		} else {
			this.grid.clear();
		}
	}

	public destroyBorder() {
		if (this.border) {
			this.border.destroy();
			this.border = null;
		}
	}

	public destroyResizeHandles() {
		if (this.resizeHandles.length) {
			this.resizeHandles.forEach((handle) => {
				handle.destroy();
			});
			this.resizeHandles.length = 0;
		}
	}

	public destroyBezierHandles() {
		if (this.bezierHandles.length) {
			this.bezierHandles.forEach((handle) => {
				handle.destroy();
			});
			this.bezierHandles.length = 0;
		}
	}

	public destroyBezierCurveHandle() {
		if (this.bezierCurveHandles.length) {
			this.bezierCurveHandles.forEach((handle) => {
				handle.destroy();
			});
			this.bezierCurveHandles.length = 0;
		}
	}

	public destroyLineHandles() {
		if (this.lineHandles.length) {
			this.lineHandles.forEach((handle) => {
				handle.destroy();
			});
			this.lineHandles.length = 0;
		}
	}

	public destroyResizeHitArea() {
		if (this.resizeHitAreas.length) {
			this.resizeHitAreas.forEach((hit) => {
				hit.destroy();
			});
			this.resizeHitAreas.length = 0;
		}
	}

	public createBorder(attr: Partial<GraphicUIProperties>) {
		this.border = new Border(attr);
		this.border.zIndex = 10;
		this.addChildAt(
			this.border,
			this.children.length - 8 > 0 ? this.children.length - 8 : this.children.length,
		);
	}

	public createResizeHandles(x: number, y: number, width: number, height: number) {
		const size = 5;
		const offset = size / this.scaled;

		const scaledLeft = x + offset / 4;
		const scaledRight = x - offset / 4 + width;
		const scaledTop = y + offset / 4;
		const scaledBottom = y - offset / 4 + height;

		const handlePositions: Array<HandleOptions> = [
			{ x: scaledLeft, y: scaledTop, cursor: 'nwse-resize', handleId: ResizeHandle.LT },
			{ x: scaledRight, y: scaledTop, cursor: 'nesw-resize', handleId: ResizeHandle.RT },
			{ x: scaledRight, y: scaledBottom, cursor: 'nwse-resize', handleId: ResizeHandle.RB },
			{ x: scaledLeft, y: scaledBottom, cursor: 'nesw-resize', handleId: ResizeHandle.LB },
		];

		// TEST: for testing the handles position
		// const color = [0xd5d5d5, 0xff00ff, 0x00ffff, 0xffff00];

		for (const element of handlePositions) {
			const { handleId, ...attr } = element;

			const handle = new Handle({
				...attr,
				color: 0xd5d5d5,
				radius: size,
				scale: this.scaled,
			});
			handle.zIndex = 100;
			handle.handleId = handleId;
			this.resizeHandles.push(handle);
			this.addChildAt(handle, this.children.length);
			if (this._isHiddenUI) handle.visible = false;
		}
	}

	public createBezierHandles(x: number, y: number, width: number, height: number) {
		const size = 5;
		const float = 15;
		const offset = float / this.scaled;

		const top = { x: x + width / 2, y: y - offset };
		const right = { x: x + width + offset, y: y + height / 2 };
		const bottom = { x: x + width / 2, y: y + height + offset };
		const left = { x: x - offset, y: y + height / 2 };

		const handlePositions: Array<HandleOptions> = [
			{ ...top, cursor: 'pointer', handleId: BezierHandle.T },
			{ ...right, cursor: 'pointer', handleId: BezierHandle.R },
			{ ...bottom, cursor: 'pointer', handleId: BezierHandle.B },
			{ ...left, cursor: 'pointer', handleId: BezierHandle.L },
		];

		// TEST: for testing the handles position
		// const color = [0xd5d5d5, 0xff00ff, 0x00ffff, 0xffff00];

		for (const element of handlePositions) {
			const { handleId, ...attr } = element;

			const handle = new Handle({
				...attr,
				radius: size,
				scale: this.scaled,
				alpha: 0.5,
			});
			handle.zIndex = 100;
			handle.handleId = handleId;
			this.bezierHandles.push(handle);
			this.addChildAt(handle, this.children.length);
			if (this._isHiddenUI) handle.visible = false;
		}
	}

	public createBezierCurveHandle(start: ElementPosition, end: ElementPosition) {
		const size = 5;

		const handlePositions: Array<HandleOptions> = [
			{ ...start, cursor: 'pointer', handleId: BezierCurveHandle.P1 },
			{ ...end, cursor: 'pointer', handleId: BezierCurveHandle.P2 },
		];

		for (const element of handlePositions) {
			const { handleId, ...attr } = element;

			const handle = new Handle({
				...attr,
				radius: size,
				scale: this.scaled,
				alpha: 1,
			});
			handle.zIndex = 100;
			handle.handleId = handleId;
			this.bezierCurveHandles.push(handle);
			this.addChildAt(handle, this.children.length);
			if (this._isHiddenUI) handle.visible = false;
		}
	}

	public createResizeHitAreas(x: number, y: number, width: number, height: number) {
		const size = 5;
		const scale = this.scaled;

		const hitLineLeft = x;
		const hitLineRight = x + width;
		const hitLineTop = y;
		const hitLineBottom = y + height;

		const hitAreaPosition: Array<HitAreaOptions> = [
			{
				x: hitLineLeft,
				y: hitLineTop,
				endX: hitLineRight,
				endY: hitLineTop,
				cursor: 'ns-resize',
				handleId: ResizeHandle.T,
			},
			{
				x: hitLineRight,
				y: hitLineTop,
				endX: hitLineRight,
				endY: hitLineBottom,
				cursor: 'ew-resize',
				handleId: ResizeHandle.R,
			},
			{
				x: hitLineLeft,
				y: hitLineBottom,
				endX: hitLineRight,
				endY: hitLineBottom,
				cursor: 'ns-resize',
				handleId: ResizeHandle.B,
			},
			{
				x: hitLineLeft,
				y: hitLineBottom,
				endX: hitLineLeft,
				endY: hitLineTop,
				cursor: 'ew-resize',
				handleId: ResizeHandle.L,
			},
		];

		for (const element of hitAreaPosition) {
			const { handleId, ...attr } = element;

			const line = new HitArea({
				...attr,
				alpha: 0,
				lineWidth: size,
				scale: scale,
			});
			line.zIndex = 100;
			line.handleId = handleId;
			this.resizeHitAreas.push(line);
			this.addChildAt(line, this.children.length);
			if (this._isHiddenUI) line.visible = false;
		}
	}

	public updateResizeHandles(attr: Partial<GraphicUIProperties>, redraw: boolean) {
		const scale = this.scaled;
		const size = 5 / scale;

		const { x, y, width, height } = attr;

		const scaledLeft = x + size / 4;
		const scaledRight = x - size / 4 + width;
		const scaledTop = y + size / 4;
		const scaledBottom = y - size / 4 + height;

		const positions = [
			{ x: scaledLeft, y: scaledTop },
			{ x: scaledRight, y: scaledTop },
			{ x: scaledRight, y: scaledBottom },
			{ x: scaledLeft, y: scaledBottom },
		];

		for (let n = 0; n < this.resizeHandles.length; n++) {
			if (redraw) this.resizeHandles[n].draw({ ...positions[n], scale: scale });
			else this.resizeHandles[n].position.set(positions[n].x, positions[n].y);
		}
	}

	public updateBezierHandles(attr: Partial<GraphicUIProperties>, redraw: boolean) {
		const scale = this.scaled;
		const float = 15;
		const offset = Math.max(1, float / scale);

		const { x, y, width, height } = attr;

		const top = { x: x + width / 2, y: y - offset };
		const right = { x: x + width + offset, y: y + height / 2 };
		const bottom = { x: x + width / 2, y: y + height + offset };
		const left = { x: x - offset, y: y + height / 2 };

		const positions = [{ ...top }, { ...right }, { ...bottom }, { ...left }];

		for (let n = 0; n < this.bezierHandles.length; n++) {
			if (redraw) this.bezierHandles[n].draw({ ...positions[n], scale: scale });
			else this.bezierHandles[n].position.set(positions[n].x, positions[n].y);
		}
	}

	public updateBezierCurveHandle(start: ElementPosition, end: ElementPosition, redraw: boolean) {
		const scale = Math.min(3, this.scaled);

		const positions = [{ ...start }, { ...end }];

		for (let n = 0; n < this.bezierCurveHandles.length; n++) {
			if (redraw) this.bezierCurveHandles[n].draw({ ...positions[n], scale: scale });
			else this.bezierCurveHandles[n].position.set(positions[n].x, positions[n].y);
		}
	}

	public updateResizeHitAreas(attr: Partial<GraphicUIProperties>) {
		const scale = this.scaled;
		const size = 5 / scale;

		const { x, y, width, height } = attr;

		const hitLineLeft = x;
		const hitLineRight = x + width;
		const hitLineTop = y;
		const hitLineBottom = y + height;

		const positions = [
			{ x: hitLineLeft, y: hitLineTop, endX: hitLineRight, endY: hitLineTop },
			{ x: hitLineRight, y: hitLineTop, endX: hitLineRight, endY: hitLineBottom },
			{ x: hitLineLeft, y: hitLineBottom, endX: hitLineRight, endY: hitLineBottom },
			{ x: hitLineLeft, y: hitLineBottom, endX: hitLineLeft, endY: hitLineTop },
		];

		for (let n = 0; n < this.resizeHitAreas.length; n++) {
			this.resizeHitAreas[n].draw({
				...positions[n],
				lineWidth: size,
				scale: scale,
			});
		}
	}

	public toggleUIVisibilty(visible: boolean) {
		for (const element of this.resizeHandles) {
			element.visible = visible;
		}

		for (const element of this.bezierHandles) {
			element.visible = visible;
		}

		for (const element of this.resizeHitAreas) {
			element.visible = visible;
		}

		for (const element of this.bezierCurveHandles) {
			element.visible = visible;
		}
	}
}
