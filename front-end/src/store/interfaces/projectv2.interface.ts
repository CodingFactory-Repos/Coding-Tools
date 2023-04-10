import { Scene } from "@/lib/pixi-tools-v2/scene";
import { LiteralGeometryTypes } from "@/lib/pixi-tools-v2/types/pixi-enums";
import { SelectionBox } from '@/lib/pixi-tools-v2/class/selectionBox';

export interface ProjectStorev2 {
	scene: Scene;
	canvas: HTMLCanvasElement;
	deferredGeometry: LiteralGeometryTypes;
	default: boolean;
	selectionBox: SelectionBox;
	onFullscreen: boolean;
	immersion: boolean;
	viewportDefaultPos: ViewportDefaultPosition;
	selectedFrameNumber: number;

	getZoom?: () => number;
	getFrames?: () => Array<number>;

	toggleImmersion?: () => void;
	removeGeometryEvent?: () => void;
	enableSelectionBox?: (destroy?: boolean) => void;
	setDeferredEvent?: (cursor: CSSStyleProperty.Cursor, framed: boolean) => void;
	createGeometry?: () => void;
	createFramedGeometry?: () => void;
	increaseZoom?: () => void;
	decreaseZoom?: () => void;
	setFrameCanvas?: (frameNumber: number) => void;
	setDefaultCanvas?: () => void;
	canvasDownload?: () => void;
}

export interface ViewportDefaultPosition {
	scale?: { x: number, y: number },
	pos?: { x: number, y: number },
}