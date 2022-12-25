import 'pixi-viewport';
import { Container, DisplayObject, DisplayObjectEvents } from 'pixi.js';

type ArgumentMap<T> = {
	[K in keyof T]: T[K] extends (...args: infer U) => any ? U : never;
};

interface ViewportEvents extends DisplayObjectEvents {
	zoomed: [];
}

declare module 'pixi-viewport' {
	interface Viewport extends Container<DisplayObject> {
		on<T extends keyof ViewportEvents>(
			event: T,
			fn: (...args: ArgumentMap<ViewportEvents>[Extract<T, keyof ViewportEvents>]) => void,
			context?: any,
		): this;
	}

	export interface PixiEvents extends Viewport {}
}

/**
 * Don't even ask, my mind is about to explose after 2 hours of testing
 * All this for typed event in pixi-viewport, smh.
 */