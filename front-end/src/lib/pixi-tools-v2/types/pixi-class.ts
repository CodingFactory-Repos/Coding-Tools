import { Container, DisplayObject, FederatedPointerEvent, Graphics } from 'pixi.js';
import { ContainerManager } from '../class/containerManager';
import { GenericContainer } from '../class/genericContainer';
import { GraphicTypeId, InternalTypeId, SerializedGraphic, SerializedGraphicBounds } from './pixi-serialize';
import { Rectangle } from '../model/template';
import type { GraphicUIProperties } from './pixi-ui';

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

	protected abstract updateAbsoluteBounds(): void;
	abstract getGeometry(): Bounds;
	abstract getGraphicChildren(): Array<DisplayObject>;
}

export abstract class PluginContainer extends BoundsContainer {
	protected readonly manager: ContainerManager;
	protected abstract onSelected(e: FederatedPointerEvent): void;
}

export abstract class ModelGraphics extends Graphics implements WithId {
	public readonly uuid: string;
	public readonly typeId: GraphicTypeId | InternalTypeId;
	public color: number;
	public cursor: CSSStyleProperty.Cursor;

	abstract draw(attr: Partial<GraphicUIProperties>): void;
	abstract serialized(): SerializedGraphic;
	abstract serializedBounds(): SerializedGraphicBounds;
}

export class FramedMainContainer extends Container {
	public readonly children: Array<GenericContainer | Rectangle>;
}

export class TitleContainer extends Container {
	public tabNumberContext: number;
}