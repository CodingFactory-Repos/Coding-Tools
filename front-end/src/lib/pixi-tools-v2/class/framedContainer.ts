import { Container, FederatedPointerEvent, Text } from "pixi.js";
import { Border } from "../model/model-constructor/border";
import { ContainerContext } from "../types/pixi-container-options";
import { Viewport } from 'pixi-viewport';
import { ContainerManager } from "./containerManager";
import { GenericContainer } from "./genericContainer";

export class FramedContainer extends Container {
	public id: string;
	public frameNumber: number;
	private _mainContainer: Container;
	private _titleContainer: Container;
	private _title: Text;
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
		this._viewport = context.viewport;
		this._manager = context.manager;
		this._mainContainer = new Container();
		this._titleContainer = new Container();
		this._titleContainer.interactive = true;
		this._mainContainer.interactive = true;

		this.frameNumber = this._viewport.children.filter(el => el.id === "frame").length;
		this._title = new Text(`Frame ${this.frameNumber}`, { fontSize: 14, fill: 0xffffff });
		
		for(let i = 0; i < context.constructors.length; i++) {
			const attributes =  context.constructors[i].attributes;
			const genericContainer = new GenericContainer({
				stage: context.stage,
				viewport: context.viewport,
				manager: context.manager,
				constructors: [{
					Graphic: context.constructors[i].Graphic,
					attributes: attributes,
				}]
			}, {
				isAttached: true,
				to: this.frameNumber,
			});
			this._mainContainer.addChild(genericContainer);

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

		this._titleContainer.on("pointerdown", this._onTitleSelected.bind(this));
	}

	private _onTitleSelected(e: FederatedPointerEvent) {
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
		this._border = new Border({
			x: this._containerX,
			y: this._containerY,
			width: this._mainContainer.width,
			height: this._mainContainer.height,
			scale: this._viewport.scale.x,
		});
		this.addChild(this._border);
	}

	get mainContainer(): Container {
		return this._mainContainer;
	}
}