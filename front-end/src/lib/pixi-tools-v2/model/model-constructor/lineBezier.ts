import { LINE_CAP, Polygon } from 'pixi.js';
import { ModelGraphics } from '../../types/pixi-class';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelSerializer } from '../../utils/modelSerializer';
import { ElementPosition } from '../../types/pixi-container';

interface XYZ extends ElementPosition {
	z: number;
}

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

	static registerGraphic(attributes: SerializedGraphic) {
		return new LineBezier(attributes);
	}

	constructor(attributes: SerializedGraphic) {
		super();

		const { uuid, typeId, bounds, properties } = attributes;

		this.uuid = uuid;
		this.typeId = typeId as GraphicTypeId;
		this.interactive = properties.interactive;
		this.cursor = properties.cursor;
		this.color = properties.color;
		this.alpha = properties.alpha;
		this.start = bounds.start ?? { x: 200, y: 200 };
		this.end = bounds.end ?? { x: 300, y: 300}
		this.startControl = bounds.startControl ?? { x: 250, y: 200};
		this.endControl = bounds.endControl ?? { x: 300, y: 300}

		this.draw();
	}

	public draw() {
		this.clear();
		this.lineStyle(4, this.color);
		this.line.cap = LINE_CAP.ROUND;

		const arrowSize = 10; // Adjust this value as needed
		const angleOffset = Math.PI / 8; // Adjust this value to control the arrowhead shape

		this.moveTo(this.start.x, this.start.y);
		this.bezierCurveTo(
			this.startControl.x, this.startControl.y,
			this.endControl.x, this.endControl.y,
			this.end.x, this.end.y
		);
		//! Used to check the position of the controls
		// this.drawCircle(this.startControl.x, this.startControl.y, 10);
		// this.drawCircle(this.endControl.x, this.endControl.y, 10);
		this.drawArrowHead(arrowSize, angleOffset);

		this.getBounds();
		this.perfectPolygonLine();
	}

	private drawArrowHead(arrowSize: number, angleOffset: number) {
		let angle: number;

		if(this.angleControl === undefined) {
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
		this.beginFill(this.color);
		this.moveTo(arrowX, arrowY);
		this.lineTo(baseX1, baseY1);
		this.lineTo(baseX2, baseY2);
		this.lineTo(arrowX, arrowY);
		this.endFill();
	}

	private perfectPolygonLine() {
		const points = this.geometry.points;

		const od: Array<XYZ> = [];
		const even: Array<XYZ> = [];
		// based of this logic : https://www.cnblogs.com/3body/p/14981937.html
		// source code from oushu1liangqi1 : https://github.com/pixijs/pixijs/issues/7058
		for (let index = 0; index * 2 < points.length; index++) {
			const x = points[index * 2];
			const y = points[index * 2 + 1];
			const z = points[index * 2 + 2];

			if (index % 2 === 0) od.push({ x, y, z });
			else even.push({ x, y, z });
		}
		this.hitArea = new Polygon([...od, ...even.reverse()]);
	}

	public serialized() {
		return modelSerializer(this);
	}

	public serializedBounds() {
		return modelBounds(this);
	}
}
