import { Container, DisplayObject, FederatedPointerEvent, Graphics } from "pixi.js";
import { ContainerManager } from "../class/containerManager";
import { GenericContainer } from "../class/genericContainer";
import { SerializedGraphic } from './pixi-serialize';
import { GraphicAttributes } from "./pixi-container";
import { Rectangle } from "../model/template";

export interface Bounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

export abstract class WithId {
	public readonly uuid: string;
	public readonly typeId: string;
}

export abstract class BoundsContainer extends Container {
	public absMinX: number;
	public absMinY: number;
	public absMaxX: number;
	public absMaxY: number;

	protected updateAbsoluteBounds(): void {};
	abstract getGeometry(): Bounds;
	abstract getGraphicChildren(): Array<DisplayObject>;
}

export abstract class PluginContainer extends BoundsContainer {
	protected readonly manager: ContainerManager;
	protected onSelected(e: FederatedPointerEvent): void {};
}

export abstract class ModelGraphics extends Graphics implements WithId {
	public readonly uuid: string;
	public readonly typeId: string;
	public color: number;
	public cursor: CSSStyleProperty.Cursor;
	
	abstract draw(attr: GraphicAttributes): void;
	abstract serialized(): SerializedGraphic;
}

export class FramedMainContainer extends Container {
	public readonly children: Array<GenericContainer | Rectangle>
}