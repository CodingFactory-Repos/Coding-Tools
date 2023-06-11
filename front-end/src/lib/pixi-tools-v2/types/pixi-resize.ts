import { ResizeHandle } from "./pixi-enums";

export interface InitialResizeOptions {
	parentInitialWidth: number;
	parentInitialHeight: number;
	childInitialX?: number;
	childInitialY?: number;
	childInitialWidth?: number;
	childInitialHeight?: number;
}

export interface PrimeOptions {
	parentPrimeWidth: number;
	parentPrimeHeight: number;
}

export interface ProportionScaleOptions extends InitialResizeOptions, PrimeOptions {
	anchorX: number;
	anchorY: number;
}

export interface ParentOrthogonalPrimeOptions {
	handleId: ResizeHandle;
	initialWidth: number;
	initialHeight: number;
	dx: number;
	dy: number;
}
export interface ParentPrimeOptions extends ParentOrthogonalPrimeOptions {
	ratioA: number;
	ratioB: number;
	isShift: boolean;
}

export interface ResizeMetrics {
	dx: number;
	dy: number;
}

export interface ResizeRatioMetrics extends ResizeMetrics {
	ratioA: number;
	ratioB: number;
}