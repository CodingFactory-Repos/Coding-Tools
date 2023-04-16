import 'pixi-viewport';
import { Container, DisplayObject } from 'pixi.js';
import { CanvasContainer } from '../pixi-aliases';

declare module 'pixi-viewport' {
	interface Viewport extends Container<DisplayObject> {
		readonly children: Array<CanvasContainer>;
	}
}
