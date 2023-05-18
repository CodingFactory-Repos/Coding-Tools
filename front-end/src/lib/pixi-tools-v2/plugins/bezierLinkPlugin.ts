import { FederatedPointerEvent } from 'pixi.js';
import { ViewportUI } from '../viewportUI';
import type { PluginContainer } from '../types/pixi-aliases';
import { Handle } from '../model/template-ui';
import { BezierHandle } from '../types/pixi-enums';
import { LineBezier } from '../model/template';
import { generateUniqueId } from '../utils/uniqueId';
import { ElementPosition } from '../types/pixi-container';


export class BezierPlugin {
	protected readonly viewport: ViewportUI;
	protected container: PluginContainer = null;
	protected handleId: BezierHandle = null;
	protected start: ElementPosition;
	protected end: ElementPosition;
	protected lineBezier: LineBezier;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
	}

	public attach(container: PluginContainer) {
		this.container = container;

		const { x, y, width, height } = this.container.getGeometry();
		this.viewport.createBezierHandles(x, y, width, height);

		this.viewport.bezierHandles.forEach((handle) => {
			handle.on('pointerdown', this._initBezierCurve.bind(this));
		});
	}

	public detach() {
		this.viewport.destroyBezierHandles();
	}

	private _initBezierCurve = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		const target = e.target as Handle;
		this.handleId = target.handleId;
		console.log(target)

		const handle = this.viewport.bezierHandles[this.handleId];
		const float = 15;
		const offset = float / this.viewport.scaled;

		switch(this.handleId) {
			case BezierHandle.T: {
				this.start = { x: handle.x, y: handle.y + offset };
				break;
			}
			case BezierHandle.R: {
				this.start = { x: handle.x - offset, y: handle.y };
				break;
			}
			case BezierHandle.L: {
				this.start = { x: handle.x + offset, y: handle.y };
				break;
			}
			case BezierHandle.B: {
				this.start = { x: handle.x, y: handle.y - offset };
				break;
			}
		}

		this.lineBezier = new LineBezier({
			uuid: generateUniqueId(),
			typeId: "bezier",
			bounds: {
				start: this.start,
				end: { x: handle.x, y: handle.y },
				control: { x: this.start.x, y: this.start.y },
				startControl: { x: this.start.x, y: this.start.y },
				endControl:  { x: handle.x, y: handle.y },
			},
			properties: {
				interactive: true,
				cursor: "pointer",
				color: 0xffffff,
				alpha: 1
			}
		})

		this.viewport.addChildAt(this.lineBezier, this.viewport.children.length - 13);

		// need to be last
		this.container.on('pointerdown', this._cancelBezierCurve);
		this.viewport.on('pointerup', this._overrideViewportPointerUp);
		this.viewport.on('mouseleave', this._cancelBezierCurve);
		this.viewport.on('pointermove', this._updateBezierCurve);
		this.viewport.on('pointerdown', this._createBezierCurve);
	};

	private _updateBezierCurve = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		const point = this.viewport.toWorld(e.global.clone());
		this.end = { x: point.x, y: point.y };
		const lineLength = this._getLineLength();
		let startControl = {
			x: this.start.x,
			y: this.start.y,
		}

		switch(this.handleId) {
			case BezierHandle.T: {
				startControl.y -= lineLength;
				break;
			}
			case BezierHandle.R: {
				startControl.x += lineLength;
				break;
			}
			case BezierHandle.L: {
				startControl.x -= lineLength;
				break;
			}
			case BezierHandle.B: {
				startControl.y += lineLength;
				break;
			}
		}

		const controlPoint2 = {
			x: (this.end.x + point.x) / 2,
			y: (this.end.y + point.y) / 2
		};

		this.lineBezier.startControl = startControl;
		this.lineBezier.endControl = controlPoint2
		this.lineBezier.end = this.end;
		this.lineBezier.draw();
	};

	private _createBezierCurve = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		this.lineBezier.draw();
		this._cancelBezierCurve(e);
	};

	private _cancelBezierCurve = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		try {
			this.container.off('pointerdown', this._cancelBezierCurve);
			this._removeViewportBezierEvent();
			this.start = undefined;
			this.end = undefined;
			this.handleId = null;
		} catch (err) {
			if (err instanceof Error) {
				console.error('Unexpected error during end resize :', err.message);
			}
		}
	};

	private _removeViewportBezierEvent = () => {
		this.viewport.off('pointerup', this._overrideViewportPointerUp);
		this.viewport.off('mouseleave', this._cancelBezierCurve);
		this.viewport.off('pointermove', this._updateBezierCurve);
		this.viewport.off('pointerdown', this._createBezierCurve);
	}

	private _getLineLength = () => {
		const dx = this.end.x - this.start.x;
		const dy = this.end.y - this.start.y;
		return Math.sqrt(dx * dx + dy * dy) / 2;
	}

	private _overrideViewportPointerUp = (e: FederatedPointerEvent) => {
		if(e) e.stopPropagation();
	}
}
