import { Container, FederatedPointerEvent, Text } from "pixi.js";
import { Border } from "../model/model-constructor/border";
import { ContainerContext } from "../types/pixi-container-options";
import { Viewport } from 'pixi-viewport';
import { ContainerManager } from "./containerManager";
import { GenericContainer } from "./genericContainer";
import { Rectangle } from "../model/model-constructor/rectangle";

export class FramedContainer extends Container {
	public id: string;
	public isAttachedToFrame: boolean;
	public frameNumber: number;
	private _mainContainer: Container;
	private _titleContainer: Container;
	private _emptySpace: Rectangle;
	private _title: Text;
	private _viewport: Viewport;
	private _manager: ContainerManager;
	private _border: Border;

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
			const genericContainer = new GenericContainer({
				stage: context.stage,
				viewport: context.viewport,
				manager: context.manager,
				constructors: [{
					Graphic: context.constructors[i].Graphic,
					attributes: context.constructors[i].attributes,
				}]
			}, {
				isAttached: true,
				to: this.frameNumber,
			});
			this._mainContainer.addChild(genericContainer);
		}

		this.addChild(this._mainContainer);
		
		const { x, y } = this._mainContainer.getLocalBounds();
		
		this._emptySpace = new Rectangle({ 
			x: (x / 2),
			y: (y / 2),
			width: this._mainContainer.width,
			height: this._mainContainer.height,
			color: 0,
			scale: this._viewport.scaled,
		});
		this._mainContainer.addChildAt(this._emptySpace, 0);
		
		this._title.x = (x / 2);
		this._title.y = (y / 2);
		this._titleContainer.x = (x / 2);
		this._titleContainer.y = (y / 2) - 30; //padding
		this._titleContainer.addChild(this._title);

		this.addChild(this._titleContainer);
		this._titleContainer.on("pointerdown", this._onTitleSelected.bind(this));

	}

	private _onTitleSelected(e: FederatedPointerEvent) {
		e.stopPropagation();
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

	public getFrameLocalBounds() {
		return this._mainContainer.getLocalBounds();
	}

	public drawBorder() {
		const { x, y } = this._mainContainer.getLocalBounds();

		this._border = new Border({
			x: (x / 2),
			y: (y / 2),
			width: this._mainContainer.width,
			height: this._mainContainer.height,
			scale: this._viewport.scaled,
		});
		this.addChild(this._border);
	}

	get mainContainer(): Container {
		return this._mainContainer;
	}
}