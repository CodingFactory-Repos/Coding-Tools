import { Point, Text, TextMetrics } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { lowestNumberFinder } from '../utils/numberFinder';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { PixiEventMode } from '../types/pixi-enums';

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
	const tableLineY = startY + width / 10;
	const lineWidth = 4;

	const fontSize = 30;
	const fontFamily = 'Arial';
	const fontWeight = 'bold';
	const goalText = "Objectifs";
	const actorText = "Acteurs";
	const impactText = "Impacts";
	const deliText = "Délivrables";

	const tempText = new Text('', {
		fontSize: fontSize,
		fontFamily: fontFamily,
		fontWeight: fontWeight,
	});

	const { width: goalTextWidth, height: goalTextHeight } = TextMetrics.measureText(goalText, tempText.style);
	const { width: actorTextWidth } = TextMetrics.measureText(actorText, tempText.style);
	const { width: impactTextWidth } = TextMetrics.measureText(impactText, tempText.style);
	const { width: deliTextWidth } = TextMetrics.measureText(deliText, tempText.style);
	tempText.destroy();

	const textQuarterCenter = width / 8;
	const textY = startY + ((width / 10) / 2) - goalTextHeight / 2;
	const goalTextX = startX + textQuarterCenter - (goalTextWidth / 2);
	const actorTextX = startX + textQuarterCenter + quarter - (actorTextWidth / 2);
	const impactTextX = startX + textQuarterCenter + (quarter * 2) - (impactTextWidth / 2);
	const deliTextX = startX + textQuarterCenter + (quarter * 3) - (deliTextWidth / 2);

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
		},
		childs: [
			{ //! first | line
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
			{ //! second | line
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
			{ //! third | line
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
			{ //! only -- line
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
			{ //! FirstQuarterCenter Text
				typeId: 'text',
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
						typeId: 'textarea',
						properties: {
							cursor: 'pointer',
							eventMode: 'none',
							color: 0x000000,
							alpha: 1,
							text: goalText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: goalTextX,
							y: textY,
						},
					},
				],
			},
			{ //! SecondQuarterCenter Text
				typeId: 'text',
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
						typeId: 'textarea',
						properties: {
							cursor: 'pointer',
							eventMode: 'none',
							color: 0x000000,
							alpha: 1,
							text: actorText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: actorTextX,
							y: textY,
						},
					},
				],
			},
			{ //! ThirdQuarterCenter Text
				typeId: 'text',
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
						typeId: 'textarea',
						properties: {
							cursor: 'pointer',
							eventMode: 'none',
							color: 0x000000,
							alpha: 1,
							text: impactText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: impactTextX,
							y: textY,
						},
					},
				],
			},
			{ //! FourthQuarterCenter Text
				typeId: 'text',
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
						typeId: 'textarea',
						properties: {
							cursor: 'pointer',
							eventMode: 'none',
							color: 0x000000,
							alpha: 1,
							text: deliText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: deliTextX,
							y: textY,
						},
					},
				],
			},
		],
	};
};
