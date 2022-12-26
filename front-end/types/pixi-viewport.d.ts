import 'pixi-viewport';
import { ArgumentMapNever } from '@/lib/pixi-tools/types/pixi-subclass-emitter';
import { Container, DisplayObject, DisplayObjectEvents } from 'pixi.js';

interface ViewportEvents extends DisplayObjectEvents {
	zoomed: [];
}

declare module 'pixi-viewport' {
	interface Viewport extends Container<DisplayObject> {
		on<T extends keyof ViewportEvents>(
			event: T,
			fn: (...args: ArgumentMapNever<ViewportEvents>[Extract<T, keyof ViewportEvents>]) => void,
			context?: this,
		): this;
	}

	export interface PixiEvents extends Viewport {}
}