import { Scene } from '@/lib/pixi-tools-v2/scene';
import { BlueprintKey, LiteralGeometryTypes } from '@/lib/pixi-tools-v2/types/pixi-enums';
import { SelectionBox } from '@/lib/pixi-tools-v2/class/selectionBox';
import { CanvasContainer } from '@/lib/pixi-tools-v2/types/pixi-aliases';
import { FederatedPointerEvent } from 'pixi.js';
import { LitteralBlueprintTypes } from '@/store/interfaces/agility.interface';
import { ContainerTypeId } from '@/lib/pixi-tools-v2/types/pixi-serialize';
import { PersonaBuilder } from '@/lib/pixi-tools-v2/blueprint/personas';
import { DeepPartial } from '@/interfaces/advanced-types.interface';

export interface ProjectStore {
	scene: Scene;
	canvas: HTMLCanvasElement;
	deferredGeometry: LiteralGeometryTypes;
	deferredContainer: ContainerTypeId;
	deferredBlueprint: LitteralBlueprintTypes;
	default: boolean;
	selectionBox: SelectionBox;
	onFullscreen: boolean;
	immersion: boolean;
	viewportDefaultPos: ViewportDefaultPosition;
	selectedFrameNumber: number;
	pdfViewerOpen: boolean;
	refreshPdfViewer: number;
	timerId: NodeJS.Timeout;
	personaBuilder: DeepPartial<PersonaBuilder>;
	baseTemplate: BlueprintKey;
	internalLoading: boolean;

	getZoom?: () => number;
	getFrames?: () => Array<number>;
	getSelected?: () => Array<CanvasContainer>;

	startRefreshing?: () => void;
	stopRefreshing?: () => void;
	toggleImmersion?: () => void;
	removeGeometryEvent?: () => void;
	enableSelectionBox?: (destroy?: boolean) => void;
	setDeferredEvent?: (cursor: CSSStyleProperty.Cursor, framed: boolean) => void;
	setBlueprintEvent?: (cursor: CSSStyleProperty.Cursor) => void;
	createGeometry?: () => void;
	createFramedGeometry?: (event: FederatedPointerEvent) => void;
	createBlueprint?: (event: FederatedPointerEvent) => void;
	increaseZoom?: () => void;
	decreaseZoom?: () => void;
	setFrameCanvas?: (frameNumber: number) => void;
	setDefaultCanvas?: () => void;
	canvasDownload?: (mime: string) => void;
}

export interface ViewportDefaultPosition {
	scale?: { x: number; y: number };
	pos?: { x: number; y: number };
}

export interface FramedPDF {
	id: string;
	order: number;
	base64: string;
	isBlueprint: boolean,
	typeBlueprint: number,
	dimension: {
		width: number;
		height: number;
	};
}

export interface DraggableUpdatePayload {
	moved: {
		element: FramedPDF;
		newIndex: number;
		oldIndex: number;
	};
}
