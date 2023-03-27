import 'pixi-viewport';
import { ArgumentMapNever } from '@/lib/pixi-tools/types/pixi-subclass-emitter';
import { Container, DisplayObject, DisplayObjectEvents } from 'pixi.js';
import { CanvasContainer } from '@/lib/pixi-tools-v2/types/pixi-container-options';

interface ViewportEvents extends DisplayObjectEvents {
	zoomed: [];
}

declare module 'pixi-viewport' {
	interface Viewport extends Container<DisplayObject> {
		readonly children: Array<CanvasContainer>;

		on<T extends keyof ViewportEvents>(
			event: T,
			fn: (...args: ArgumentMapNever<ViewportEvents>[Extract<T, keyof ViewportEvents>]) => void,
			context?: this,
		): this;
	}

	export interface PixiEvents extends Viewport {}
}