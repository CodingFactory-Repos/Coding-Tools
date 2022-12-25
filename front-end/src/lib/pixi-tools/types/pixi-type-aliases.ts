import { Container, DisplayObject } from "pixi.js";

/**
 * A type representing a stage in a PIXI.js application.
 * @typedef {PIXI.Container<PIXI.DisplayObject>} Stage
 */
export type Stage = Container<DisplayObject>;