import EventEmitter from "events";
import { ArgumentMapTyped, EventParameters } from "../types";

/**
 * A custom event emitter that allows for strongly-typed events.
 * @template E - The type of event parameters for events emitted by this emitter.
 */
export class CustomEmitter<E extends EventParameters<E>> extends EventEmitter {
	/**
	 * Adds a listener for a specific event.
	 * @param event - The name of the event to listen for.
	 * @param fn - The event handler function.
	 * @returns The CustomEmitter instance.
	 */
	on<T extends Extract<keyof E, string | symbol>>(
		event: T,
		fn: (...args: ArgumentMapTyped<E>[T]) => void,
	): this {
		super.on(event, fn);
		return this;
	}

	/**
	 * Removes a listener for a specific event.
	 * @param event - The name of the event to remove the listener for.
	 * @param fn - The event handler function to remove.
	 * @returns The CustomEmitter instance.
	 */
	off<T extends Extract<keyof E, string | symbol>>(
		event: T,
		fn: (...args: ArgumentMapTyped<E>[T]) => void,
	): this {
		super.off(event, fn);
		return this;
	}

	/**
	 * Emits an event, triggering all registered event handlers.
	 * @param event - The name of the event to emit.
	 * @param args - Any arguments to pass to the event handlers.
	 * @returns `true` if the event had listeners, `false` otherwise.
	 */
	emit<T extends Extract<keyof E, string | symbol>>(
		event: T,
		...args: ArgumentMapTyped<E>[T]
	): boolean {
		return super.emit(event, args);
	}
}