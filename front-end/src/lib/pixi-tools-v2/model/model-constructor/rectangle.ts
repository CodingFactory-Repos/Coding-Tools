import { FederatedPointerEvent, Graphics } from 'pixi.js';
import { GraphicSelector } from '../../class/selector';
import { GraphicAttributes } from '../../types/pixi-container-options';
import { GenericContainer } from '../../class/genericContainer';
import { FramedContainer } from '../../class/framedContainer';

export class Rectangle extends Graphics implements GraphicSelector {
	private _color: number;
	private _isSelected: boolean;

	constructor(attr: GraphicAttributes) {
		super();

		const { width, height, x, y, color } = attr;

		this._color = color;
		this._isSelected = false;
		this.interactive = true;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.beginFill(this._color);
		this.drawRect(x, y, width, height);
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

	public set isSelected(value: boolean) {
		this._isSelected = value;
	}
}
