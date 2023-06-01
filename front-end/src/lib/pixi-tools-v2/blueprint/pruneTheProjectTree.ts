import { Point } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { lowestNumberFinder } from '../utils/numberFinder';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { PixiEventMode } from '../types/pixi-enums';

export const pruneTheProjectTree = (
	viewport: ViewportUI,
	point: Point,
	width: number,
	height: number,
): Partial<SerializedContainer> => {
	const allFrames = viewport.children.filter((ctn) => ctn instanceof FramedContainer);
	const frameNumbers = allFrames.map((frame) => frame.frameNumber);
	const frameNumber = lowestNumberFinder(frameNumbers);

	const startX = point.x - width / 2;
	const startY = point.y - height / 2;
	const endX = point.x + width / 2;
	const endY = point.y + height / 2;

	const centerX = width / 2;
	const foliageHeightOffset = height * 0.05;
	const firstLineOffset = width * 0.2;
	const treeWidth = width * 0.9;
	const treeHeight = height * 0.9;
	const foliageWidth = width * 0.9;
	const foliageHeight = height * 0.7;

	//! WARNING: Ellipse and Tree aren't supported for the resize.

	return {
		typeId: 'frame',
		background: {
			typeId: 'framebox',
			properties: {
				cursor: 'pointer',
				eventMode: PixiEventMode.STATIC,
				color: 0xff00ff,
				alpha: 0,
				borderWidth: 0,
				borderColor: 0x000000,
			},
			bounds: {
				x: point.x - centerX,
				y: point.y - height / 2,
				width,
				height,
			},
		},
		properties: {
			cursor: 'pointer',
			eventMode: PixiEventMode.STATIC,
			tabNumberContext: -1,
			isAttachedToFrame: false,
			frameNumber: frameNumber,
			disabled: false,
		},
		childs: [
			/*******************************
				PRUNE THE TREE [SQUELETON]
			 *******************************/

			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					eventMode: 'none',
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
					disabled: true,
				},
				childs: [
					{
						typeId: 'ellipse',
						properties: {
							cursor: 'pointer',
							eventMode: 'none',
							color: 0x228b22,
							alpha: 0.2,
							borderWidth: 0,
							borderColor: 0x000000,
						},
						bounds: {
							x: point.x,
							y: point.y - foliageHeightOffset,
							width: foliageWidth,
							height: foliageHeight,
						},
					},
				],
			},
			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					eventMode: 'none',
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
					disabled: true,
				},
				childs: [
					{
						typeId: 'tree',
						properties: {
							cursor: 'none',
							eventMode: 'none',
							color: 0x000000,
							borderWidth: 30,
							alpha: 0.6,
						},
						bounds: {
							x: point.x,
							y: endY,
							width: treeWidth,
							height: treeHeight,
						},
					},
				],
			},
			{
				typeId: 'line',
				properties: {
					cursor: 'pointer',
					eventMode: 'none',
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
					disabled: true,
				},
				childs: [
					{
						typeId: 'bezier',
						properties: {
							cursor: 'pointer',
							eventMode: 'none',
							color: 0x9fb6bc,
							arrowHead: false,
							dashed: true,
							alpha: 1,
						},
						lineControl: {
							start: { x: startX + firstLineOffset, y: endY },
							end: { x: endX - firstLineOffset, y: endY },
							startControl: { x: startX + firstLineOffset, y: startY + firstLineOffset * 1.5 },
							endControl: { x: endX - firstLineOffset, y: startY + firstLineOffset * 1.5 },
						},
					},
				],
			},
			{
				typeId: 'line',
				properties: {
					cursor: 'pointer',
					eventMode: 'none',
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
					disabled: true,
				},
				childs: [
					{
						typeId: 'bezier',
						properties: {
							cursor: 'pointer',
							eventMode: 'none',
							color: 0x9fb6bc,
							arrowHead: false,
							dashed: true,
							alpha: 1,
						},
						lineControl: {
							start: { x: endX - width, y: endY },
							end: { x: endX, y: endY },
							startControl: { x: startX, y: startY },
							endControl: { x: startX + width, y: startY },
						},
					},
				],
			},
		],
	};
};
