import { Viewport } from "pixi-viewport";
import { Container } from "pixi.js";
import { Border } from "../model/model-constructor/border";
import { CanvasContainer } from "../types/pixi-container-options";
import { FramedContainer } from "./framedContainer";


export class WrappedContainer extends Container {
	public id: string;
	public readonly children: Array<CanvasContainer>
	private _viewport: Viewport;
	private _border: Border;

	constructor(viewport: Viewport) {
		super();

		this.id = "wrap";
		this.cursor = "pointer";
		this.interactive = true;
		this._viewport = viewport;
	}

	public destroyBorder() {
		if(this._border) {
			this._border.destroy();
			this._border = null;
		}
	}

	public drawBorder() {
		this.destroyBorder();

		const { x, y } = this.getLocalBounds();

		this._border = new Border({
			x: (x / 2),
			y: (y / 2),
			width: this.width,
			height: this.height,
			scale: this._viewport.scale.x
		})
		this.addChild(this._border);
	}

	public restoreOriginChildren() {
		const framed = this.children.filter(ctn => ctn.isAttachedToFrame);
		for(let n = 0; n < framed.length; n++) {
			const frame = this._viewport.children.find(ctn => ctn.id === "frame" && ctn.frameNumber === framed[n].frameNumber) as FramedContainer;
			if(frame) frame.mainContainer.addChild(framed[n]);
		}

		if(this.children.length > 0) {
			this._viewport.addChild(...this.children);
		}
	}


	//! I have something in mind, but we'll see when i get there witht the lib
	// addChild<U extends DisplayObject[]>(...children: U): U[0] {
	// 	if (children.length > 1) {
	// 		for (let i = 0; i < children.length; i++) {
	// 			this.addChild(children[i]);
	// 		}
	// 	} else {
	// 		const child = children[0];
	// 		if (child.parent) {
	// 			child.parent.removeChild(child);
	// 		}
	// 		child.parent = this;
	// 		this.sortDirty = true;
	// 		child.transform._parentID = -1;
	// 		this.children.push(child);
	// 		this._boundsID++;
	// 		this.onChildrenChange(this.children.length - 1);
	// 		this.emit("childAdded", child, this, this.children.length - 1);
	// 		child.emit("added", this);
	// 	}
	// 	return children[0];
	// }
}