import { ModelGraphics } from '../../types/pixi-class';
import { GraphicUIProperties } from '../../types/pixi-ui';
import { InternalTypeId } from '../../types/pixi-serialize';
import { generateUniqueId } from '../../utils/uniqueId';
import { modelSerializer } from '../../utils/modelSerializer';
import { modelBounds } from '../../utils/modelBounds';

export class Grid extends ModelGraphics {
	protected readonly gridSpacing = 1; // 1 pixel
	protected readonly lineWidth = 1;
	protected readonly offset = 5;
	public readonly uuid: string;
	public readonly typeId: InternalTypeId;
	public cursor: CSSStyleProperty.Cursor;
	public color: number;

	constructor(attr: Partial<GraphicUIProperties>) {
		super();

		const { color } = attr;

		this.typeId = 'grid';
		this.uuid = generateUniqueId();
		this.color = color;
	}

	public draw(attr: Partial<GraphicUIProperties>) {
		const { width, height, scale, left, top } = attr;

		const viewportWidth = width;
		const viewportHeight = height;
		const lineWidth = this.lineWidth / scale;

		this.clear();
		this.lineStyle(lineWidth, this.color);

		const startX =
			Math.floor((-viewportWidth - this.offset) / 2 / this.gridSpacing) * this.gridSpacing;
		const endX =
			Math.floor((viewportWidth + this.offset) / 2 / this.gridSpacing) * this.gridSpacing;
		const startY =
			Math.floor((-viewportHeight - this.offset) / 2 / this.gridSpacing) * this.gridSpacing;
		const endY =
			Math.floor((viewportHeight + this.offset) / 2 / this.gridSpacing) * this.gridSpacing;

		for (let i = startX; i <= endX; i += this.gridSpacing) {
			this.moveTo(i, startY);
			this.lineTo(i, endY);
		}

		for (let i = startY; i <= endY; i += this.gridSpacing) {
			this.moveTo(startX, i);
			this.lineTo(endX, i);
		}

		this.position.set(Math.floor(viewportWidth / 2 + left), Math.floor(viewportHeight / 2 + top));
	}

	public serialized() {
		return modelSerializer(this);
	}

	public serializedBounds() {
		return modelBounds(this);
	}
}
