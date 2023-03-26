import { FederatedEvent, FederatedPointerEvent, Graphics } from 'pixi.js';
import { FramedContainer } from '../../class/framedContainer';
import { GenericContainer } from '../../class/genericContainer';
import { GraphicSelector } from '../../class/selector';
import { GraphicAttributes } from '../../types/pixi-container-options';

export class Circle extends Graphics implements GraphicSelector {
	private _color: number;
	private _radius: number;
	private _isSelected: boolean;

	constructor(attr: GraphicAttributes) {
		super();

		const { x, y, color, radius } = attr;

		this._color = color;
		this._radius = radius;
		this._isSelected = false;
		this.interactive = true;

		this.x = x;
		this.y = y;
		this.beginFill(this._color);
		this.drawCircle(x, y, radius);
		this.endFill();
	}

	public onSelect(e: FederatedPointerEvent, parent: GenericContainer | FramedContainer): void {
		if(!this._isSelected) {
			e.stopPropagation();
			this._isSelected = true;

			parent.drawChildBorder({
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
			});
		}
	}
}
