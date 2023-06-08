import { Point } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { lowestNumberFinder } from '../utils/numberFinder';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { PixiEventMode } from '../types/pixi-enums';

export const empathyMap = (
	viewport: ViewportUI,
	point: Point,
	width: number,
	height: number,
): Partial<SerializedContainer> => {
	const allFrames = viewport.children.filter((ctn) => ctn instanceof FramedContainer);
	const frameNumbers = allFrames.map((frame) => frame.frameNumber);
	const frameNumber = lowestNumberFinder(frameNumbers);

	const centerX = width / 2;
	const centerY = height / 2;
	const largeZone = height * 0.38; // 100 - 38 * 2 = 24;
	const circleRadius = width / 9;

	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const startX = point.x - halfWidth;
	const startY = point.y - halfHeight;
	const endX = point.x + halfWidth;
	const endY = point.y + halfHeight;
	const lineWidth = 4;

	return {
		typeId: 'frame',
		background: {
			typeId: 'framebox',
			properties: {
				cursor: 'pointer',
				eventMode: PixiEventMode.STATIC,
				color: 0xffffff,
				alpha: 1,
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
							start: { x: startX + lineWidth / 2, y: startY + lineWidth / 2 },
							end: {
								x: endX - lineWidth / 2,
								y: point.y - centerY + largeZone * 2 - lineWidth / 2,
							},
							startControl: { x: startX + lineWidth / 2, y: startY + lineWidth / 2 },
							endControl: {
								x: endX - lineWidth / 2,
								y: point.y - centerY + largeZone * 2 - lineWidth / 2,
							},
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
							start: { x: endX - lineWidth / 2, y: startY + lineWidth / 2 },
							end: {
								x: startX + lineWidth / 2,
								y: point.y - centerY + largeZone * 2 - lineWidth / 2,
							},
							startControl: { x: endX - lineWidth / 2, y: startY + lineWidth / 2 },
							endControl: {
								x: startX + lineWidth / 2,
								y: point.y - centerY + largeZone * 2 - lineWidth / 2,
							},
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
							start: { x: point.x, y: point.y - centerY + largeZone * 2 + lineWidth / 2 },
							end: { x: point.x, y: endY - lineWidth / 2 },
							startControl: { x: point.x, y: point.y - centerY + largeZone * 2 + lineWidth / 2 },
							endControl: { x: point.x, y: endY - lineWidth / 2 },
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
							start: { x: startX + lineWidth / 2, y: point.y - centerY + largeZone * 2 },
							end: { x: endX - lineWidth / 2, y: point.y - centerY + largeZone * 2 },
							startControl: { x: startX + lineWidth / 2, y: point.y - centerY + largeZone * 2 },
							endControl: { x: endX - lineWidth / 2, y: point.y - centerY + largeZone * 2 },
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
						typeId: 'circle',
						properties: {
							cursor: 'pointer',
							eventMode: 'none',
							color: 0xffffff,
							alpha: 1,
							borderWidth: 3,
							borderColor: 0x9fb6bc,
						},
						bounds: {
							x: point.x - circleRadius,
							y: point.y - centerY + largeZone - circleRadius,
							radius: circleRadius,
						},
					},
				],
			},
		],
	};
};
