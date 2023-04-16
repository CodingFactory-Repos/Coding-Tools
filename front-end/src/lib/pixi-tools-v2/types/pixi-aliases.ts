import { Container, DisplayObject } from 'pixi.js';

import { FramedContainer } from '../class/framedContainer';
import { GenericContainer } from '../class/genericContainer';
import { WrappedContainer } from '../class/wrappedContainer';

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
