import { Graphics } from "pixi.js";
import { ResizeCornerKeyLiteral, ResizeEdgeKeyLiteral } from "./pixi-type-aliases";

/**
 * ResizeGraphic subclass represents a graphic used for resizing an element.
 */
export class ResizeGraphic extends Graphics {
	/**
	 * The identifier for the resize graphic, either a `ResizeEdgeKeyLiteral` or a `ResizeCornerKeyLiteral`.
	 */
	public id: ResizeEdgeKeyLiteral | ResizeCornerKeyLiteral;
}