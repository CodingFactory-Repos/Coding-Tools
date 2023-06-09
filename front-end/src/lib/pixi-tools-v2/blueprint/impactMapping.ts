import { Point } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { lowestNumberFinder } from '../utils/numberFinder';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { PixiEventMode, TypeBlueprint } from '../types/pixi-enums';

export const impactMapping = (
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
	const startX = point.x - halfWidth;
	const startY = point.y - halfHeight;
	const endX = point.x + halfWidth;
	const endY = point.y + halfHeight;

	const quarter = width / 4;
	const firstQuarterX = startX + quarter;
	const secondQuarterX = startX + quarter * 2;
	const thirdQuarterX = startX + quarter * 3;
	const lineWidth = 4;

	const tableLineY = startY + width / 10;

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
			typeBlueprint: TypeBlueprint.IMPACT_MAPPING,
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
							start: { x: firstQuarterX, y: startY + lineWidth / 2 },
							end: { x: firstQuarterX, y: endY - lineWidth / 2 },
							startControl: { x: firstQuarterX, y: startY + lineWidth / 2 },
							endControl: { x: firstQuarterX, y: endY - lineWidth / 2 },
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
							start: { x: secondQuarterX, y: startY + lineWidth / 2 },
							end: { x: secondQuarterX, y: endY - lineWidth / 2 },
							startControl: { x: secondQuarterX, y: startY + lineWidth / 2 },
							endControl: { x: secondQuarterX, y: endY - lineWidth / 2 },
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
							start: { x: thirdQuarterX, y: startY + lineWidth / 2 },
							end: { x: thirdQuarterX, y: endY - lineWidth / 2 },
							startControl: { x: thirdQuarterX, y: startY + lineWidth / 2 },
							endControl: { x: thirdQuarterX, y: endY - lineWidth / 2 },
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
							start: { x: startX + lineWidth / 2, y: tableLineY },
							end: { x: endX - lineWidth / 2, y: tableLineY },
							startControl: { x: startX + lineWidth / 2, y: tableLineY },
							endControl: { x: endX - lineWidth / 2, y: tableLineY },
						},
					},
				],
			},
		],
	};
};
