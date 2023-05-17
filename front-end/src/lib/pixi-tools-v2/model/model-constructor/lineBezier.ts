import { Point, Polygon } from 'pixi.js';
import { ModelGraphics } from '../../types/pixi-class';
// import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelSerializer } from '../../utils/modelSerializer';

interface XYZ {
	x: number;
	y: number;
	z: number;
}

export class LineBezier extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public color: number;
	public start: { x: number; y: number };
	public control: { x: number; y: number };
	public end: { x: number; y: number };
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
		this.start = { x: 100, y: 100};
		this.control = { x: 200, y: 50};
		this.end = { x: 400, y: 300};

		this.draw();
	}

	public draw() {
		this.clear();
		this.lineStyle(2, this.color);

		this.moveTo(this.start.x, this.start.y);
		this.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);

		this.on("added", () => {
			const points = this.geometry.points;

			const od: Array<XYZ> = []
			const even: Array<XYZ> = []
			for (let index = 0; index * 2 < points.length; index++) {
				const x = points[index * 2];
				const y = points[index * 2 + 1];
				const z = points[index * 2 + 2];

				if (index % 2 === 0) od.push({ x, y, z });
				else even.push({ x, y, z });
			}
			this.hitArea = new Polygon([...od, ...even.reverse()]);
		})
	}

	public serialized() {
		return modelSerializer(this);
	}

	public serializedBounds() {
		return modelBounds(this);
	}
}
