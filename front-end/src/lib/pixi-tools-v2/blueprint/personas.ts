import { Point } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { lowestNumberFinder } from '../utils/numberFinder';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { PixiEventMode } from '../types/pixi-enums';

export const personas = (
	viewport: ViewportUI,
	point: Point,
	width: number,
	height: number,
): Partial<SerializedContainer> => {
	const allFrames = viewport.children.filter((ctn) => ctn instanceof FramedContainer);
	const frameNumbers = allFrames.map((frame) => frame.frameNumber);
	const frameNumber = lowestNumberFinder(frameNumbers);

	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const centerX = point.x;
	const centerY = point.y;
	const startX = centerX - halfWidth;
	const startY = centerY - halfHeight;
	const endX = centerX + halfWidth;
	const endY = centerY + halfHeight;

	const threeFiveX = startX + (width * (3/5));
	const oneFourX = startX + (width * (1.25/4));
	const threeFourX = startX + (width * (2.75/4));
	const largeZone = height * 0.40; // 100 - 40 * 2 = 20;
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
				x: startX,
				y: startY,
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
			isBlueprint: true,
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
							start: { x: startX + lineWidth / 2, y: point.y - halfHeight + largeZone },
							end: { x: endX - lineWidth / 2, y: point.y - halfHeight + largeZone },
							startControl: { x: startX + lineWidth / 2, y: point.y - halfHeight + largeZone },
							endControl: { x: endX - lineWidth / 2, y: point.y - halfHeight + largeZone },
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
							start: { x: threeFiveX, y: startY + lineWidth / 2 },
							end: { x: threeFiveX, y: startY + largeZone + lineWidth / 2 },
							startControl: { x: threeFiveX, y: startY + lineWidth / 2 },
							endControl: { x: threeFiveX, y: startY + largeZone + lineWidth / 2 },
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
							start: { x: oneFourX, y: startY + largeZone + lineWidth / 2 },
							end: { x: oneFourX, y: startY + (largeZone * 2) + lineWidth / 2 },
							startControl: { x: oneFourX, y: startY + largeZone + lineWidth / 2 },
							endControl: { x: oneFourX, y: startY + (largeZone * 2) + lineWidth / 2 },
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
							start: { x: threeFourX, y: startY + largeZone + lineWidth / 2 },
							end: { x: threeFourX, y: startY + (largeZone * 2) + lineWidth / 2 },
							startControl: { x: threeFourX, y: startY + largeZone + lineWidth / 2 },
							endControl: { x: threeFourX, y: startY + (largeZone * 2) + lineWidth / 2 },
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
							start: { x: startX + lineWidth / 2, y: point.y - halfHeight + largeZone * 2 },
							end: { x: endX - lineWidth / 2, y: point.y - halfHeight + largeZone * 2 },
							startControl: { x: startX + lineWidth / 2, y: point.y - halfHeight + largeZone * 2 },
							endControl: { x: endX - lineWidth / 2, y: point.y - halfHeight + largeZone * 2 },
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
							start: { x: centerX, y: point.y - halfHeight + largeZone * 2 + lineWidth / 2 },
							end: { x: centerX, y: endY - lineWidth / 2 },
							startControl: { x: centerX, y: point.y - halfHeight + largeZone * 2 + lineWidth / 2 },
							endControl: { x: centerX, y: endY - lineWidth / 2 },
						},
					},
				],
			},
		],
	};
};
