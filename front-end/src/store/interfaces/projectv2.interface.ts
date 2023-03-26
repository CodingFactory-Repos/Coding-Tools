import { Normalizer } from "@/lib/pixi-tools-v2/class/normalyzer";
import { Scene } from "@/lib/pixi-tools-v2/scene";
import { LiteralGeometryTypes } from "@/lib/pixi-tools-v2/types/pixi-enums";

export interface ProjectStorev2 {
	scene: Scene;
	canvas: HTMLCanvasElement;
	deferredGeometry: LiteralGeometryTypes;

	setDeferredEvent?: (cursor: CSStyleProperty.Cursor, framed: boolean) => void;
	createGeometry?: () => void;
	createFramedGeometry?: () => void;
}