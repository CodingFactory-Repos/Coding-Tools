import { Container, DisplayObject, FederatedPointerEvent, Graphics } from "pixi.js";
import { ContainerManager } from "../class/containerManager";
import { GenericContainer } from "../class/genericContainer";
import { GraphicAttributes } from "./pixi-container-options";

export interface Bounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

export abstract class WithId {
	public readonly id: string;
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
	public readonly id: string;
	protected color: number;
	public cursor: CSStyleProperty.Cursor;
	
	abstract draw(attr: GraphicAttributes): void;
}

export class FramedMainContainer extends Container {
	public readonly children: Array<GenericContainer>
}