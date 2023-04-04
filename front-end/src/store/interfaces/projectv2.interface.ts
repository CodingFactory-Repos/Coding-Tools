import { Scene } from "@/lib/pixi-tools-v2/scene";
import { LiteralGeometryTypes } from "@/lib/pixi-tools-v2/types/pixi-enums";
import { SelectionBox } from '@/lib/pixi-tools-v2/class/selectionBox';
import { FramedContainer } from "@/lib/pixi-tools-v2/class/framedContainer";

export interface ProjectStorev2 {
	scene: Scene;
	canvas: HTMLCanvasElement;
	deferredGeometry: LiteralGeometryTypes;
	default: boolean;
	selectionBox: SelectionBox;
	onFullscreen: boolean;
	immersion: boolean;
	frames: Array<FramedContainer>;
	viewportDefaultPos: ViewportDefaultPosition;

	getZoom?: () => number;

	toggleImmersion?: () => void;
	removeGeometryEvent?: () => void;
	enableSelectionBox?: (destroy?: boolean) => void;
	setDeferredEvent?: (cursor: CSStyleProperty.Cursor, framed: boolean) => void;
	createGeometry?: () => void;
	createFramedGeometry?: () => void;
	increaseZoom?: () => void;
	decreaseZoom?: () => void;
	setFrameCanvas?: (index: number) => void;
	setDefaultCanvas?: () => void;
}

export interface ViewportDefaultPosition {
	scale?: { x: number, y: number },
	pos?: { x: number, y: number },
}