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
		this.start = bounds.start;
		this.end = bounds.end;
		this.startControl = bounds.startControl;
		this.endControl = bounds.endControl;

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
		this.drawArrowHead(arrowSize, angleOffset);

		// generate geometry.points
		this.getBounds();
		this.perfectPolygonLine();
	}

	private drawArrowHead(arrowSize: number, angleOffset: number) {
		const angle = Math.atan2(this.end.y - this.startControl.y, this.end.x - this.startControl.x);

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

		const od: Array<XYZ> = []
		const even: Array<XYZ> = []
		// based of this logic : https://www.cnblogs.com/3body/p/14981937.html
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
