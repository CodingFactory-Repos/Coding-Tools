import { Scene } from '@/lib/pixi-tools/scene';

export interface ProjectStore {
	scene: Scene;
	canvas: HTMLCanvasElement;
	action: ProjectAction;
	meta: Partial<ProjectMetaDetails>;
	viewportBounds: ViewportBounds;

	setScene?: (scene: Scene) => void;
	setCanvas?: (canvas: HTMLCanvasElement) => void;
	setAction?: (cursor: string, target: number) => void;
	updateCursor?: (cursor: string) => void;
	activateFocusMode?: () => boolean;
	deactivateFocusMode?: () => void;
	_createCanvasElement?: () => void;
}

export interface ProjectMetaDetails {
	title: string;
	owner: string;
	description: string;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export interface ProjectAction {
	cursor: string;
	target: number;
}

export enum Target {
	DEFAULT = 0,
	TEXT = 1,
	POSTIT = 2,
	FRAME = 3,
}

export interface ViewportBounds {
	posX: number;
	posY: number;
	scaleX: number;
	scaleY: number;
}
