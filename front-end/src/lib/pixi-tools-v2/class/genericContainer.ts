import { Container } from "pixi.js";
import { ContainerContext } from "../types/pixi-container-options";

export class GenericContainer extends Container {
	constructor(context: ContainerContext) {
		super();

		this.cursor = "pointer";
		
		for(let i = 0; i < context.constructors.length; i++) {
			const { Graphic, attributes } = context.constructors[i];
			const element = new Graphic(attributes);
			this.addChild(element);
		}
	}
}