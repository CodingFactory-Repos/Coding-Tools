import { Container, FederatedPointerEvent, Text } from "pixi.js";
import { Border } from "../model/model-constructor/border";
import { ContainerContext, GraphicAttributes } from "../types/pixi-container-options";
import { Viewport } from 'pixi-viewport';
import { ContainerManager } from "./containerManager";

export class FramedContainer extends Container {
	public id: string;
	private _mainContainer: Container;
	private _titleContainer: Container;
	private _title: Text;
	private _isSelected: boolean;
	private _viewport: Viewport;
	private _manager: ContainerManager;
	private _border: Border;
	private _containerX = Infinity;
	private _containerY = Infinity;

	constructor(context: ContainerContext) {
		super();

		this.id = "frame";
		this.cursor = "pointer";
		this.interactive = true;
		this._isSelected = false;
		this._viewport = context.viewport;
		this._manager = context.manager;
		this._mainContainer = new Container();
		this._titleContainer = new Container();
		this._titleContainer.interactive = true;
		this._mainContainer.interactive = true;

		const frameNumber = this._viewport.children.filter(el => el.id === "frame").length;
		this._title = new Text(`Frame ${frameNumber}`, { fontSize: 14, fill: 0xffffff });
		
		for(let i = 0; i < context.constructors.length; i++) {
			const { Graphic, attributes } = context.constructors[i];
			const element = new Graphic(attributes);
			element.on("pointerdown", this._onChildSelected.bind(this));
			this._mainContainer.addChild(element);

			if (attributes.x < this._containerX) this._containerX = attributes.x;
			if (attributes.y < this._containerY) this._containerY = attributes.y;
		}

		this._title.x = this._containerX;
		this._title.y = this._containerY;
		this._titleContainer.x = this._containerX;
		this._titleContainer.y = this._containerY - 30; //padding
		this._titleContainer.addChild(this._title);

		this.addChild(this._mainContainer);
		this.addChild(this._titleContainer);

		this._titleContainer.on("pointerdown", () => this._onTitleSelect());
	}

	private _onChildSelected(e: FederatedPointerEvent) {
		// e.shiftKey even if known in the object return undefined;
		const isShift = e.originalEvent.shiftKey;
		this._manager.selectContainer(this, isShift);
	}

	private _onTitleSelect(): void {
		if(!this._isSelected) {
			this._isSelected = true;
			this._destroyBorder();
			this._mainContainer.children.forEach(el => { el.isSelected = false });
			this._drawBorder();
		}
	}

	private _destroyBorder() {
		if(this._border) {
			this._border.destroy();
			this._border = null;
		}
	}

	private _drawBorder() {
		this._border = new Border({
			x: this._containerX,
			y: this._containerY,
			width: this._mainContainer.width,
			height: this._mainContainer.height,
			scale: this._viewport.scale.x,
		});
		this.addChild(this._border);
	}

	public drawChildBorder(attr: GraphicAttributes) {
		this._isSelected = false;
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

	public set isSelected(value: boolean) {
		this._destroyBorder();
		this._isSelected = value;
	}

	public get isSelected(): boolean {
		return this._isSelected;
	}
}