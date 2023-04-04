import "pixi.js";

declare module "pixi.js" {
	interface FederatedEvent {
	  shiftKey: boolean;
	}

	interface FederatedPointerEvent {
		/**
		 * Augmented property defining when an event was emitted forcibly without a user action.
		 * Attach a forced FederatedPointerEvent.
		 */
		forced: boolean;
	}
}