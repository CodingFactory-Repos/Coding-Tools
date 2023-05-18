import { ModelGraphics } from '../../types/pixi-class';
import { ElementBounds } from '../../types/pixi-container';
import { GraphicTypeId, SerializedGraphic } from '../../types/pixi-serialize';
import { modelBounds } from '../../utils/modelBounds';
import { modelSerializer } from '../../utils/modelSerializer';

export class Polygon extends ModelGraphics {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public color: number;
	private faces: number;

	static registerGraphic(attributes: SerializedGraphic) {
		return new Polygon(attributes);
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
		this.faces = 6;

		this.draw(bounds);
	}

	public draw(bounds: Partial<ElementBounds>) {
		const { width, height, x, y } = bounds;
		this.position.set(x, y);
	
		const sideLength = Math.min(width, height);
		const vertices = this.calculatePolygonVertices(sideLength, width, height);
		console.log(this.findPolygonCenter(vertices))

		this.clear();
		this.beginFill(this.color);

		// const centerX = width / 2;
		// const centerY = height / 2;

		//! Does the same thing as centerX and centerY on the calculatePolygonVertices method
		// const matrix = new Matrix();
		// matrix.translate(centerX, centerY);
		// this.setMatrix(matrix);

		//! Does the same thing as centerX and centerY on the calculatePolygonVertices method
		// this.pivot.set(centerX, centerY)
		this.drawPolygon(vertices);
		this.endFill();

		this.height = height;
		this.width = width;
		console.log("FINAL WIDTH", this.width, this.height)
	}

	private calculatePolygonVertices(sideLength: number, width: number, height: number): number[] {
		const angleStep = (2 * Math.PI) / this.faces;
		const vertices: number[] = [];

		const startAngleOffset = angleStep / 2;
		const centerX = width / 2;
		const centerY = height / 2;

		for (let i = 0; i < this.faces; i++) {
			const angle = (i * angleStep) + startAngleOffset + Math.PI / 2;
			const x = parseFloat((centerX + (Math.cos(angle) * (sideLength / 2))).toFixed(2));
			const y = parseFloat((centerY + (Math.sin(angle) * (sideLength / 2))).toFixed(2));
			vertices.push(x, y);
		}

		return vertices;
	}

	private findPolygonCenter(vertices: Array<number>) {
		const numVertices = vertices.length;
		let sumX = 0;
		let sumY = 0;
	  
		for (let i = 0; i < numVertices; i = i + 2) {
		  sumX += vertices[i];
		  sumY += vertices[i + 1];
		}
	  
		const centerX = sumX / numVertices;
		const centerY = sumY / numVertices;
	  
		return [centerX, centerY];
	}

	public serialized() {
		return modelSerializer(this);
	}

	public serializedBounds() {
		return modelBounds(this);
	}
}
