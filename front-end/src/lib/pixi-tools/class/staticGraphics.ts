import { Graphics } from "pixi.js";

import { ArgumentMap, GraphicsEvents } from '../types';

/**
 * StaticGraphics is a subclass of PIXI.Graphics that extends the event emitter interface to allow
 * for custom events to be emitted and subscribed to.
 *
 * @extends PIXI.Graphics
 * @emits 'updated' - Emitted when the graphics object should be updated with new size options.
 * @emits 'cleared' - Emitted when the graphics object should be cleared.
 */
export class StaticGraphics extends Graphics {
	/**
	 * Adds a listener for a specific event.
	 * @param event - The name of the event to listen for.
	 * @param fn - The event handler function.
	 * @param context - The context for the event handler function.
	 * @returns The StaticGraphics instance.
	 */
	on<T extends keyof GraphicsEvents>(
		event: T,
		fn: (...args: ArgumentMap<GraphicsEvents>[Extract<T, keyof GraphicsEvents>]) => void,
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
	 * @returns The StaticGraphics instance.
	 */
	off<T extends keyof GraphicsEvents>(
		event: T,
		fn: (...args: ArgumentMap<GraphicsEvents>[Extract<T, keyof GraphicsEvents>]) => void,
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
	emit<T extends keyof GraphicsEvents>(
		event: T,
		...args: ArgumentMap<GraphicsEvents>[Extract<T, keyof GraphicsEvents>]
	): boolean {
		//@ts-ignore
		return super.emit(event, ...args);
	}
}