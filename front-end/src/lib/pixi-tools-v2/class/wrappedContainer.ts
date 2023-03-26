import { Viewport } from "pixi-viewport";
import { Container, Graphics } from "pixi.js";
import { Border } from "../model/model-constructor/border";


export class WrappedContainer extends Container {
	public id: string;
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

		let containerX = Infinity;
		let containerY = Infinity;

		for(let i = 0; i < this.children.length; i++) {
			for(let n = 0; n < this.children[i].children.length; n++) {
				const child = this.children[i].children[n] as Graphics;

				if(containerX > child.x) {
					containerX = child.x;
				}
				
				if(containerY > child.y) {
					containerY = child.y;
				}
			}
		}

		this._border = new Border({
			x: containerX,
			y: containerY,
			width: this.width,
			height: this.height,
			scale: this._viewport.scale.x
		})
		this.addChild(this._border);
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