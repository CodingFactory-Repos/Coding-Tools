import { Container, DisplayObject, Graphics } from 'pixi.js';

import { FramedContainer } from '../class/framedContainer';
import { GenericContainer } from '../class/genericContainer';
import { WrappedContainer } from '../class/wrappedContainer';
import { WithId } from './pixi-class';

/**
 * Type representing a stage in a PIXI.js application.
 */
export type Stage = Container<DisplayObject>;

/**
 * 
 */
export type CanvasContainer = FramedContainer | GenericContainer;

/**
 * 
 */
export type PluginContainer = CanvasContainer | WrappedContainer;

export type GraphicsId = Graphics & WithId & { color: number };