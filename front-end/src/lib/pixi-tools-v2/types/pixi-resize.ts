import { ElementPosition } from "./pixi-container";
import { ResizeHandle } from "./pixi-enums";

export interface InitialParentResizeOptions {
	parentInitialWidth: number;
	parentInitialHeight: number;
}

export interface InitialResizeOptions extends InitialParentResizeOptions {
	childInitialX?: number;
	childInitialY?: number;
	childInitialWidth?: number;
	childInitialHeight?: number;
}

export interface InitialLineResizeOptions extends InitialParentResizeOptions {
	childInitialStart?: ElementPosition;
	childInitialEnd?: ElementPosition;
	childInitialStartControl?: ElementPosition;
	childInitialEndControl?: ElementPosition;
}

export interface InitialTextResizeOptions extends InitialParentResizeOptions {
	fontSize?: string | number;
	fontPadding?: number;
}

export interface PrimeOptions {
	parentPrimeWidth: number;
	parentPrimeHeight: number;
}

export interface ResizeAnchor {
	anchorX?: number;
	anchorY?: number;
}

export interface ProportionScaleOptions extends InitialResizeOptions, PrimeOptions, ResizeAnchor {
}

export interface ProportionLineScaleOptions extends InitialLineResizeOptions, PrimeOptions, ResizeAnchor {}

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