import { FederatedPointerEvent } from 'pixi.js';
import { ViewportUI } from '../viewportUI';
import { Handle } from '../model/template-ui';
import { BezierCurveHandle, BezierHandle } from '../types/pixi-enums';
import { LineBezier } from '../model/template';
import { ElementPosition } from '../types/pixi-container';
import { LineContainer } from '../class/lineContainer';
import { getClosestElementByPoints } from '../utils/closestElementByPoints';
import { getClosestPointByPoints } from '../utils/closestPointByPoints';
import { getLengthFromPoints } from '../utils/lengthFromPoints';
import { CanvasContainer } from '../types/pixi-aliases';
import { isPointsOverlap } from '../utils/pointsOverlap';

export class BezierManipulationPlugin {
	protected readonly viewport: ViewportUI;
	protected container: LineContainer = null;
	protected handleId: BezierCurveHandle = null;
	protected start: ElementPosition;
	protected end: ElementPosition;
	protected lineBezier: LineBezier;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
	}

	public attach(container: LineContainer) {
		this.container = container;

		this.container.getGeometry();
		const { start, end } = this.container.getVertex();
		this.viewport.createBezierCurveHandle(start, end);

		this.viewport.bezierCurveHandles.forEach((handle) => {
			handle.on('pointerdown', this._initBezierCurveManipulation.bind(this));
		});
	}

	public detach() {
		this.viewport.destroyBezierCurveHandle();
	}

	private _initBezierCurveManipulation = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		const target = e.target as Handle;
		this.handleId = target.handleId;
		this.lineBezier = this.container.getGraphicChildren()[0] as LineBezier;

		// need to be last
		this.viewport.on('pointerup', this._stopBezierCurveManipulation);
		this.viewport.on('mouseleave', this._stopBezierCurveManipulation);
		this.viewport.on('pointermove', this._updateBezierCurve);
	};

	private _updateBezierCurve = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		const point = this.viewport.toWorld(e.global.clone());

		const { retrieved, closestElement } = getClosestElementByPoints(
			this.viewport.onScreenChildren,
			this.viewport.scaled,
			point,
		);

		if (retrieved) {
			this.lineBezier.color = 0xff00ff;
			const { x, y, width, height } = closestElement.bounds;
			const rectangleEdgePoints = [
				{ x: x + width / 2, y: y, id: BezierHandle.T },
				{ x: x + width, y: y + height / 2, id: BezierHandle.R },
				{ x: x, y: y + height / 2, id: BezierHandle.L },
				{ x: x + width / 2, y: y + height, id: BezierHandle.B },
			];

			const closestPoint = getClosestPointByPoints(
				rectangleEdgePoints,
				point,
				this.handleId === BezierCurveHandle.P1 ? this.lineBezier.end : this.lineBezier.start,
			);

			if (
				this.handleId === BezierCurveHandle.P1 &&
				!isPointsOverlap(this.lineBezier.start, closestPoint)
			) {
				this.lineBezier.start = closestPoint;
				const lineLength = getLengthFromPoints(this.lineBezier.start, this.lineBezier.end);
				const startControl = { ...this.lineBezier.start };
				const endControl = { ...this.lineBezier.end };
				const angleControl = { ...this.lineBezier.end };

				if (closestPoint.id === BezierHandle.T) startControl.y -= lineLength;
				if (closestPoint.id === BezierHandle.R) startControl.x += lineLength;
				if (closestPoint.id === BezierHandle.L) startControl.x -= lineLength;
				if (closestPoint.id === BezierHandle.B) startControl.y += lineLength;

				angleControl.x = this.lineBezier.end.x - startControl.x;
				angleControl.y = this.lineBezier.end.y - startControl.y;

				if (this.container.endContainer.containerUUID !== undefined) {
					const handle = this.container.endContainer.handleId;

					if (handle === BezierHandle.T) endControl.y -= lineLength;
					else if (handle === BezierHandle.R) endControl.x += lineLength;
					else if (handle === BezierHandle.L) endControl.x -= lineLength;
					else if (handle === BezierHandle.B) endControl.y += lineLength;

					angleControl.x = this.lineBezier.end.x - endControl.x;
					angleControl.y = this.lineBezier.end.y - endControl.y;
				}

				this.lineBezier.startControl = startControl;
				this.lineBezier.endControl = endControl;
				this.lineBezier.angleControl = angleControl;
				this.lineBezier.draw();

				closestElement.container.attachLine(this.container.uuid);
				this.container.attachContainer(closestElement.container.uuid, 'start', closestPoint.id);
			} else if (
				this.handleId === BezierCurveHandle.P2 &&
				!isPointsOverlap(this.lineBezier.end, closestPoint)
			) {
				this.lineBezier.end = closestPoint;
				const lineLength = getLengthFromPoints(this.lineBezier.start, this.lineBezier.end);
				const startControl = { ...this.lineBezier.start };
				const endControl = { ...this.lineBezier.end };
				const angleControl = { ...this.lineBezier.end };

				if (closestPoint.id === BezierHandle.T) endControl.y -= lineLength;
				else if (closestPoint.id === BezierHandle.R) endControl.x += lineLength;
				else if (closestPoint.id === BezierHandle.L) endControl.x -= lineLength;
				else if (closestPoint.id === BezierHandle.B) endControl.y += lineLength;

				if (this.container.startContainer.containerUUID !== undefined) {
					const handle = this.container.startContainer.handleId;

					if (handle === BezierHandle.T) startControl.y -= lineLength;
					else if (handle === BezierHandle.R) startControl.x += lineLength;
					else if (handle === BezierHandle.L) startControl.x -= lineLength;
					else if (handle === BezierHandle.B) startControl.y += lineLength;
				}

				angleControl.x = this.lineBezier.end.x - endControl.x;
				angleControl.y = this.lineBezier.end.y - endControl.y;

				this.lineBezier.startControl = startControl;
				this.lineBezier.endControl = endControl;
				this.lineBezier.angleControl = angleControl;
				this.lineBezier.draw();

				closestElement.container.attachLine(this.container.uuid);
				this.container.attachContainer(closestElement.container.uuid, 'end', closestPoint.id);
			}
		} else {
			this.lineBezier.color = 0xffffff;

			let startControl = { ...this.lineBezier.start };
			let angleControl = { ...this.lineBezier.end };
			let endControl = { ...this.lineBezier.end };

			if (this.handleId === BezierCurveHandle.P1) {
				this.lineBezier.start = point;
				startControl = { ...this.lineBezier.start };

				// if end point attached to a container
				if (this.container.endContainer.containerUUID !== undefined) {
					const lineLength = getLengthFromPoints(this.lineBezier.start, this.lineBezier.end);
					const handle = this.container.endContainer.handleId;

					if (handle === BezierHandle.T) endControl.y -= lineLength;
					else if (handle === BezierHandle.R) endControl.x += lineLength;
					else if (handle === BezierHandle.L) endControl.x -= lineLength;
					else if (handle === BezierHandle.B) endControl.y += lineLength;

					angleControl.x = this.lineBezier.end.x - endControl.x;
					angleControl.y = this.lineBezier.end.y - endControl.y;
					this.lineBezier.angleControl = angleControl;
				} else {
					const deltaX = this.lineBezier.end.x - this.lineBezier.start.x;
					const deltaY = this.lineBezier.end.y - this.lineBezier.start.y;
					const offset = 0.8;
					let angleOrigin = false;

					if (Math.abs(deltaX) > Math.abs(deltaY)) {
						if (this.lineBezier.end.x > this.lineBezier.start.x) {
							angleOrigin = true;
							startControl.x = this.lineBezier.start.x + Math.sign(deltaY) * offset * deltaY;
							endControl.x = this.lineBezier.end.x - Math.sign(deltaY) * offset * deltaY;
						} else {
							startControl.x = this.lineBezier.start.x - Math.sign(deltaY) * offset * deltaY;
							endControl.x = this.lineBezier.end.x + Math.sign(deltaY) * offset * deltaY;
						}
					} else {
						if (this.lineBezier.end.y > this.lineBezier.start.y) {
							startControl.y = this.lineBezier.start.y + Math.sign(deltaX) * offset * deltaX;
							endControl.y = this.lineBezier.end.y - Math.sign(deltaX) * offset * deltaX;
						} else {
							startControl.y = this.lineBezier.start.y - Math.sign(deltaX) * offset * deltaX;
							endControl.y = this.lineBezier.end.y + Math.sign(deltaX) * offset * deltaX;
						}
					}

					if (this.lineBezier.end.x - endControl.x === this.lineBezier.end.y - endControl.y) {
						if (angleOrigin) {
							angleControl.x = this.lineBezier.end.x - endControl.x;
							angleControl.y = this.lineBezier.end.y - endControl.y;
							this.lineBezier.angleControl = angleControl;
						}
					} else {
						angleControl.x = this.lineBezier.end.x - endControl.x;
						angleControl.y = this.lineBezier.end.y - endControl.y;
						this.lineBezier.angleControl = angleControl;
					}
				}

				if (this.container.startContainer.containerUUID !== undefined) {
					//! This breaks the purpose of the plugin but fuck it
					const container = this.viewport.socketPlugin.elements[
						this.container.startContainer.containerUUID
					] as CanvasContainer;
					container.detachLine(this.container.uuid);
					this.container.detachContainer('start');
				}
			}
			if (this.handleId === BezierCurveHandle.P2) {
				this.lineBezier.end = point;
				endControl = { ...this.lineBezier.end };
				angleControl = { ...this.lineBezier.end };

				// if start point attached to a container
				if (this.container.startContainer.containerUUID !== undefined) {
					const lineLength = getLengthFromPoints(this.lineBezier.start, this.lineBezier.end);
					const handle = this.container.startContainer.handleId;

					if (handle === BezierHandle.T) startControl.y -= lineLength;
					else if (handle === BezierHandle.R) startControl.x += lineLength;
					else if (handle === BezierHandle.L) startControl.x -= lineLength;
					else if (handle === BezierHandle.B) startControl.y += lineLength;

					angleControl.x = this.lineBezier.end.x - startControl.x;
					angleControl.y = this.lineBezier.end.y - startControl.y;
					this.lineBezier.angleControl = angleControl;
				} else {
					const deltaX = this.lineBezier.end.x - this.lineBezier.start.x;
					const deltaY = this.lineBezier.end.y - this.lineBezier.start.y;
					const offset = 0.8;
					let angleOrigin = false;

					if (Math.abs(deltaX) > Math.abs(deltaY)) {
						if (this.lineBezier.end.x > this.lineBezier.start.x) {
							angleOrigin = true;
							startControl.x = this.lineBezier.start.x + Math.sign(deltaY) * offset * deltaY;
							endControl.x = this.lineBezier.end.x - Math.sign(deltaY) * offset * deltaY;
						} else {
							startControl.x = this.lineBezier.start.x - Math.sign(deltaY) * offset * deltaY;
							endControl.x = this.lineBezier.end.x + Math.sign(deltaY) * offset * deltaY;
						}
					} else {
						if (this.lineBezier.end.y > this.lineBezier.start.y) {
							startControl.y = this.lineBezier.start.y + Math.sign(deltaX) * offset * deltaX;
							endControl.y = this.lineBezier.end.y - Math.sign(deltaX) * offset * deltaX;
						} else {
							startControl.y = this.lineBezier.start.y - Math.sign(deltaX) * offset * deltaX;
							endControl.y = this.lineBezier.end.y + Math.sign(deltaX) * offset * deltaX;
						}
					}

					if (this.lineBezier.end.x - endControl.x === this.lineBezier.end.y - endControl.y) {
						if (angleOrigin) {
							angleControl.x = this.lineBezier.end.x - endControl.x;
							angleControl.y = this.lineBezier.end.y - endControl.y;
							this.lineBezier.angleControl = angleControl;
						}
					} else {
						angleControl.x = this.lineBezier.end.x - endControl.x;
						angleControl.y = this.lineBezier.end.y - endControl.y;
						this.lineBezier.angleControl = angleControl;
					}
				}

				if (this.container.endContainer.containerUUID !== undefined) {
					//! This breaks the purpose of the plugin but fuck it
					const container = this.viewport.socketPlugin.elements[
						this.container.endContainer.containerUUID
					] as CanvasContainer;
					container.detachLine(this.container.uuid);
					this.container.detachContainer('end');
				}
			}

			this.lineBezier.startControl = startControl;
			this.lineBezier.endControl = endControl;
			this.lineBezier.draw();
		}

		this.viewport.updateBezierCurveHandle(this.lineBezier.start, this.lineBezier.end, true);
		this.viewport.socketPlugin.emit(
			'ws-line-updated',
			this.container.uuid,
			this.container.serializeControl(),
		);
	};

	private _stopBezierCurveManipulation = (e: FederatedPointerEvent) => {
		if (e) e.stopPropagation();
		if (this.container === null) return;

		try {
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
		this.viewport.off('pointerup', this._stopBezierCurveManipulation);
		this.viewport.off('mouseleave', this._stopBezierCurveManipulation);
		this.viewport.off('pointermove', this._updateBezierCurve);
	};
}
