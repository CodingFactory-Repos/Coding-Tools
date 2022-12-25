import { Container, DisplayObject } from "pixi.js";
import { ArgumentMap, ContainerEvents } from "../types";

/**
 * GraphicContainer is a subclass of PIXI.Container that extends the event emitter interface to allow
 * for custom events to be emitted and subscribed to.
 *
 * @extends PIXI.Container
 * @emits 'selectUpdated' - Emitted when the selection status of the container is updated.
 * @emits 'scaleUpdated' - Emitted when the scale of the container is updated.
 * @emits 'download' - Emitted when the container is ready to be downloaded.
 */
export class GraphicContainer extends Container<DisplayObject> {
	/**
	 * Adds a listener for a specific event.
	 * @param event - The name of the event to listen for.
	 * @param fn - The event handler function.
	 * @param context - The context for the event handler function.
	 * @returns The GraphicContainer instance.
	 */
	on<T extends keyof ContainerEvents>(
		event: T,
		fn: (...args: ArgumentMap<ContainerEvents>[Extract<T, keyof ContainerEvents>]) => void,
		context?: any,
	): this {
		//@ts-ignore
		super.on(event, fn, context);
		return this;
	}

	/**
	 * Removes a listener for a specific event.
	 * @param event - The name of the event to remove the listener for.
	 * @param fn - The event handler function to remove.
	 * @param context - The context for the event handler function.
	 * @param once - If the event handler was added with the `once` option, this should be set to `true`.
	 * @returns The GraphicContainer instance.
	 */
	off<T extends keyof ContainerEvents>(
		event: T,
		fn: (...args: ArgumentMap<ContainerEvents>[Extract<T, keyof ContainerEvents>]) => void,
		context?: any,
		once?: boolean,
	): this {
		//@ts-ignore
		super.off(event, fn, context, once);
		return this;
	}

	/**
	 * Emits an event, triggering all registered event handlers.
	 * @param event - The name of the event to emit.
	 * @param args - Any arguments to pass to the event handlers.
	 * @returns `true` if the event had listeners, `false` otherwise.
	 */
	emit<T extends keyof ContainerEvents>(
		event: T,
		...args: ArgumentMap<ContainerEvents>[Extract<T, keyof ContainerEvents>]
	): boolean {
		//@ts-ignore
		return super.emit(event, ...args);
	}
}