import "pixi.js";

declare module "pixi.js" {
	interface FederatedEvent {
	  shiftKey: boolean;
	}
}