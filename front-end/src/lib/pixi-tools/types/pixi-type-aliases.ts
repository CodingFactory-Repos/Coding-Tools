import { Container, DisplayObject, Graphics } from 'pixi.js';
import { ResizeCorner, ResizeEdge } from './pixi-enums';

/**
 * Type representing a stage in a PIXI.js application.
 */
export type Stage = Container<DisplayObject>;

/**
 * Type that represents the string literal keys of the `ResizeEdge` enum.
 */
export type ResizeEdgeKeyLiteral = keyof typeof ResizeEdge;

/**
 * Type that represents the string literal keys of the `ResizeCorner` enum.
 */
export type ResizeCornerKeyLiteral = keyof typeof ResizeCorner;

/**
 * Type that represents the string literal values of the `ResizeEdge` enum.
 */
export type ResizeEdgeValLiteral = `${ResizeEdge}`;

/**
 * Type that represents the string literal values of the `ResizeCorner` enum.
 */
export type ResizeCornerValLiteral = `${ResizeCorner}`;

/**
 * Type representing a mapping of keys to `Graphics` objects.
 * The keys can be either a value from the `ResizeEdge` or `ResizeCorner` enums.
 */
export type TransformKeys = {
	[key in ResizeCorner | ResizeEdge]: Graphics;
};
