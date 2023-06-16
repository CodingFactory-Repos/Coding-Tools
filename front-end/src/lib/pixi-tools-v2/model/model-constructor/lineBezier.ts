import { LINE_CAP, Polygon, LINE_JOIN } from 'pixi.js';
import { ModelGraphics } from '../../types/pixi-class';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { DashLineShader } from '@pixi/graphics-smooth';
import { modelBounds } from '../../utils/modelBounds';
import { modelSerializer } from '../../utils/modelSerializer';
import { ElementPosition } from '../../types/pixi-container';
import { modelColorimetry } from '../../utils/modelColorimetry';

const shader = new DashLineShader({ dash: 8, gap: 5 });

export class LineBezier extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public color: number;
	public start: ElementPosition;
	public end: ElementPosition;
	public startControl: ElementPosition;
	public endControl: ElementPosition;
	public angleControl: ElementPosition;
	public hitArea: Polygon;
	public arrowHead: boolean;
	public dashed: boolean;
	public lineWidth: number;
	private timer = null;

	static registerGraphic(attributes: SerializedGraphic) {
		return new LineBezier(attributes);
	}

	constructor(attributes: SerializedGraphic) {
		super();

		const { uuid, typeId, properties, lineControl } = attributes;

		this.uuid = uuid;
		this.typeId = typeId as GraphicTypeId;
		this.eventMode = properties.eventMode;
		this.cursor = properties.cursor;
		this.color = properties.color;
		this.alpha = properties.alpha;
		this.arrowHead = properties.arrowHead;
		this.dashed = properties.dashed;
		this.lineWidth = lineControl.lineWidth ?? 4;
		this.start = lineControl.start;
		this.end = lineControl.end;
		this.startControl = lineControl.startControl;
		this.endControl = lineControl.endControl;
		this.angleControl = lineControl?.angleControl;

		this.draw();
	}

	public draw() {
		this.clear();
		this.lineStyle({ width: this.lineWidth, color: this.color, shader: this.dashed ? shader : undefined });
		this.line.cap = LINE_CAP.ROUND;

		const arrowSize = 10; // Adjust this value as needed
		const angleOffset = Math.PI / 8; // Adjust this value to control the arrowhead shape

		this.moveTo(this.start.x, this.start.y);
		this.bezierCurveTo(
			this.startControl.x,
			this.startControl.y,
			this.endControl.x,
			this.endControl.y,
			this.end.x,
			this.end.y,
		);
		//! Used to check the position of the controls
		// this.drawCircle(this.startControl.x, this.startControl.y, 10);
		// this.drawCircle(this.endControl.x, this.endControl.y, 10);
		this.endFill();

		if (this.arrowHead) {
			this.drawArrowHead(arrowSize, angleOffset);
		}

		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}

		if (this.eventMode !== 'none') {
			this.timer = setTimeout(() => {
				this.getBounds();
				this.calculateLineHitArea();
			}, 100);
		}
	}

	private drawArrowHead(arrowSize: number, angleOffset: number) {
		let angle: number;

		if (this.angleControl === undefined) {
			angle = Math.atan2(this.end.y - this.startControl.y, this.end.x - this.startControl.x);
		} else {
			angle = Math.atan2(this.angleControl.y, this.angleControl.x);
		}

		const arrowX = this.end.x;
		const arrowY = this.end.y;

		// Calculate the coordinates for the two points forming the base of the triangle
		const baseX1 = arrowX - arrowSize * Math.cos(angle - angleOffset);
		const baseY1 = arrowY - arrowSize * Math.sin(angle - angleOffset);
		const baseX2 = arrowX - arrowSize * Math.cos(angle + angleOffset);
		const baseY2 = arrowY - arrowSize * Math.sin(angle + angleOffset);

		// Draw the triangle shape
		this.lineStyle({ width: this.lineWidth, color: this.color, join: LINE_JOIN.ROUND });
		this.beginFill(this.color);
		this.moveTo(arrowX, arrowY);
		this.lineTo(baseX1, baseY1);
		this.lineTo(baseX2, baseY2);
		this.lineTo(arrowX, arrowY);
		this.endFill();
	}

	private calculateLineHitArea() {
		const distance = this.lineWidth * 2;
		const points = this.geometry.points;

		const numPoints = points.length / 2;
		const output = new Array(points.length * 2);
		for (let i = 0; i < numPoints; i++) {
			const j = i * 2;

			// Position of current point
			const x = points[j];
			const y = points[j + 1];

			// Start
			const x0 = points[j - 2] !== undefined ? points[j - 2] : x;
			const y0 = points[j - 1] !== undefined ? points[j - 1] : y;

			// End
			const x1 = points[j + 2] !== undefined ? points[j + 2] : x;
			const y1 = points[j + 3] !== undefined ? points[j + 3] : y;

			// Get the angle of the line
			const a = Math.atan2(-x1 + x0, y1 - y0);
			const deltaX = distance * Math.cos(a);
			const deltaY = distance * Math.sin(a);

			// Add the x, y at the beginning
			output[j] = x + deltaX;
			output[j + 1] = y + deltaY;

			// Add the reflected x, y at the end
			output[output.length - 1 - j - 1] = x - deltaX;
			output[output.length - 1 - j] = y - deltaY;
		}

		// close the shape
		output.push(output[0], output[1]);
		this.hitArea = new Polygon(output);
	}

	public serialized() {
		return modelSerializer(this);
	}

	public serializedBounds() {
		return modelBounds(this);
	}

	public serializedColorimetry() {
		return modelColorimetry(this);
	}
}
