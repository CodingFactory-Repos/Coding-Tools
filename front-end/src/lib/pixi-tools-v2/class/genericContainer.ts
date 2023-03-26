import { Container } from "pixi.js";
import { Border } from "../model/model-constructor/border";
import { ContainerContext, GraphicAttributes } from "../types/pixi-container-options";
import { Viewport } from 'pixi-viewport';

export class GenericContainer extends Container {
	public id: string;
	private _viewport: Viewport;
	private _border: Border;
	private _containerX = Infinity;
	private _containerY = Infinity;

	constructor(context: ContainerContext) {
		super();

		this.id = "frame";
		this.cursor = "pointer";
		this.interactive = true;
		this._viewport = context.viewport;
		
		for(let i = 0; i < context.constructors.length; i++) {
			const { Graphic, attributes } = context.constructors[i];
			const element = new Graphic(attributes);
			element.on("pointerdown", (e) => element.onSelect(e, this));
			this.addChild(element);

			if (attributes.x < this._containerX) this._containerX = attributes.x;
			if (attributes.y < this._containerY) this._containerY = attributes.y;
		}
	}

	private _destroyBorder() {
		if(this._border) {
			this._border.destroy();
			this._border = null;
		}
	}

	public drawChildBorder(attr: GraphicAttributes) {
		this._destroyBorder();

		this._border = new Border({
			x: attr.x,
			y: attr.y,
			width: attr.width,
			height: attr.height,
			scale: this._viewport.scale.x,
		})
		this.addChild(this._border);
	}
}