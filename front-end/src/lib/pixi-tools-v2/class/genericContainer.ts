import { ContainerManager } from './containerManager';
import { Container, FederatedPointerEvent } from "pixi.js";
import { Border } from "../model/model-constructor/border";
import { ContainerContext } from "../types/pixi-container-options";
import { Viewport } from 'pixi-viewport';

export class GenericContainer extends Container {
	public id: string;
	private _border: Border;
	private _viewport: Viewport;
	private _manager: ContainerManager;

	constructor(context: ContainerContext) {
		super();

		this.cursor = "pointer";
		this.interactive = true;
		this._viewport = context.viewport;
		this._manager = context.manager;
		
		for(let i = 0; i < context.constructors.length; i++) {
			const { Graphic, attributes } = context.constructors[i];
			const element = new Graphic(attributes);
			element.on("pointerdown", this._onChildSelected);
			this.addChild(element);
		}
	}

	private _onChildSelected(e: FederatedPointerEvent) {
		// e.shiftKey even if known in the object return undefined;
		const isShift = e.originalEvent.shiftKey;
		this._manager.selectContainer(this, isShift);
	}

	public destroyBorder() {
		if(this._border) {
			this._border.destroy();
			this._border = null;
		}
	}

	public drawBorder() {
		const graphic = this.children.find(el => el.id === "graphic");

		this._border = new Border({
			x: graphic.x,
			y: graphic.y,
			width: graphic.width,
			height: graphic.height,
			scale: this._viewport.scale.x
		})
		this.addChild(this._border)
	}
}