import { FederatedPointerEvent } from 'pixi.js';
import { ViewportUI } from '../viewportUI';
import type { CanvasContainer } from '../types/pixi-aliases';
import { Handle } from '../model/template-ui';
import { BezierHandle } from '../types/pixi-enums';
import { LineBezier } from '../model/template';
import { LineContainer } from '../class/lineContainer';
import { Normalizer } from '../class/normalyzer';
import { getClosestElementByPoints } from '../utils/closestElementByPoints';
import { getClosestPointByPoints } from '../utils/closestPointByPoints';
import { getLengthFromPoints } from '../utils/lengthFromPoints';
import { isPointsOverlap } from '../utils/pointsOverlap';


export class BezierPlugin {
	protected readonly viewport: ViewportUI;
	protected container: CanvasContainer = null;
	protected handleId: BezierHandle = null;
	protected lineBezier: LineBezier;
	protected lineContainer: LineContainer;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
	}

	public attach(container: CanvasContainer) {
		//! This is a shit fix.
		if(this.container !== null) {
			this._cancelBezierCurve();
		}

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
		const handle = this.viewport.bezierHandles[this.handleId];

		const float = 15;
		const offset = float / this.viewport.scaled;

		const endControl = { x: handle.x, y: handle.y };
		const startControl = { x: handle.x, y: handle.y };
		if(this.handleId === BezierHandle.T) startControl.y += offset;
		else if(this.handleId === BezierHandle.R) startControl.x -= offset;
		else if(this.handleId === BezierHandle.L) startControl.x += offset;
		else if(this.handleId === BezierHandle.B) startControl.y -= offset;

		const lineContainer = Normalizer.container(this.viewport, {
			typeId: "line",
			childs: [
				{
					typeId: "bezier",
					lineControl: {
						start: startControl,
						end: endControl,
						startControl: startControl,
						endControl: endControl,
					}
				},
			],
		}, false, undefined, this.viewport.activeFrameNumber) as LineContainer;

		this.lineContainer = lineContainer;
		this.lineContainer.interactive = false;
		this.lineBezier = lineContainer.getGraphicChildren()[0] as LineBezier;
		this.viewport.addChildAt(this.lineContainer, this.viewport.children.length - 13);

		this.container.attachLine(this.lineContainer.uuid);
		this.lineContainer.attachContainer(this.container.uuid, "start", this.handleId);
		
		// need to be last
		this.container.on('pointerdown', this._cancelBezierCurve);
		this.viewport.on('pointerup', this._overrideViewportPointerUp);
		this.viewport.on('mouseleave', this._cancelBezierCurve);
		this.viewport.on('pointermove', this._updateBezierCurve);
		this.viewport.on('pointerdown', this._cancelBezierCurve);
	};

	private _updateBezierCurve = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		const point = this.viewport.toWorld(e.global.clone());
		const { retrieved, closestElement } = getClosestElementByPoints(
			this.viewport.onScreenChildren,
			this.viewport.scaled,
			point,
		)

		if(retrieved) {
			this.lineBezier.color = 0xff00ff;
			const { x, y, width, height } = closestElement.bounds;
			const rectangleEdgePoints = [
				{ x: x + width / 2, y: y, id: BezierHandle.T },
				{ x: x + width, y: y + height / 2 , id: BezierHandle.R},
				{ x: x, y: y + height / 2, id: BezierHandle.L },
				{ x: x + width / 2, y: y + height, id: BezierHandle.B }
			];

			const closestPoint = getClosestPointByPoints(
				rectangleEdgePoints,
				point,
				this.lineBezier.start
			)

			if(!isPointsOverlap(this.lineBezier.end, closestPoint)) {
				this.lineBezier.end = { x: closestPoint.x, y: closestPoint.y };

				const lineLength = getLengthFromPoints(this.lineBezier.start, this.lineBezier.end);
				const startControl = { ...this.lineBezier.start };
				const angleControl = { ...this.lineBezier.end };
				const endControl = { ...this.lineBezier.end };

				if(closestPoint.id === BezierHandle.T) endControl.y -= lineLength;
				else if(closestPoint.id === BezierHandle.R) endControl.x += lineLength;
				else if(closestPoint.id === BezierHandle.L) endControl.x -= lineLength;
				else if(closestPoint.id === BezierHandle.B) endControl.y += lineLength;

				if(this.handleId === BezierHandle.T) startControl.y -= lineLength;
				else if(this.handleId === BezierHandle.R) startControl.x += lineLength;
				else if(this.handleId === BezierHandle.L) startControl.x -= lineLength;
				else if(this.handleId === BezierHandle.B) startControl.y += lineLength;

				angleControl.x = this.lineBezier.end.x - endControl.x,
				angleControl.y = this.lineBezier.end.y - endControl.y,

				this.lineBezier.angleControl = angleControl;
				this.lineBezier.startControl = startControl;
				this.lineBezier.endControl = endControl;
				this.lineBezier.draw();

				// if(!closestElement.container.linkedLinesUUID.includes(this.lineContainer.uuid)) {
					closestElement.container.attachLine(this.lineContainer.uuid);
					this.lineContainer.attachContainer(closestElement.container.uuid, "end", closestPoint.id);
				// }
			}
		} else {
			this.lineBezier.color = 0xffffff;
			this.lineBezier.end = point;

			const lineLength = getLengthFromPoints(this.lineBezier.start, this.lineBezier.end);
			const startControl = { ...this.lineBezier.start };
			const angleControl = { ...this.lineBezier.end };
			const endControl = { ...this.lineBezier.end };

			if(this.handleId === BezierHandle.T) startControl.y -= lineLength;
			else if(this.handleId === BezierHandle.R) startControl.x += lineLength;
			else if(this.handleId === BezierHandle.L) startControl.x -= lineLength;
			else if(this.handleId === BezierHandle.B) startControl.y += lineLength;

			angleControl.x = this.lineBezier.end.x - startControl.x;
			angleControl.y = this.lineBezier.end.y - startControl.y;

			this.lineBezier.startControl = startControl;
			this.lineBezier.endControl = endControl;
			this.lineBezier.angleControl = angleControl;
			this.lineBezier.draw();

			if(this.lineContainer.endContainer.containerUUID !== undefined) {
				//! This breaks the purpose of the plugin but fuck it
				const container = this.viewport.socketPlugin.elements[this.lineContainer.endContainer.containerUUID] as CanvasContainer;
				container.detachLine(this.lineContainer.uuid);
				this.lineContainer.detachContainer("end");
			}
		}

		this.viewport.socketPlugin.emit(
			'ws-line-updated',
			this.lineContainer.uuid,
			this.lineContainer.serializeControl(),
		);
	};

	private _cancelBezierCurve = (e?: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		try {
			this.container.off('pointerdown', this._cancelBezierCurve);
			this._removeViewportBezierEvent();
			if(this.lineContainer) {
				this.lineContainer.interactive = true;
			}
			this.lineContainer = null;
			this.lineBezier = null;
			this.handleId = null;
			this.container = null;
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
		this.viewport.off('pointerdown', this._cancelBezierCurve);
	}

	private _overrideViewportPointerUp = (e: FederatedPointerEvent) => {
		if(e) e.stopPropagation();
	}
}
