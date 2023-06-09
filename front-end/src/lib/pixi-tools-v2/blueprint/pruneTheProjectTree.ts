import { Point, Text, TextMetrics } from 'pixi.js';
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

	const firstLineOffset = width * 0.2;
	const modifiedWidth = width + firstLineOffset * 2;

	const startX = point.x - modifiedWidth / 2;
	const startY = point.y - height / 2;
	const endX = point.x + modifiedWidth / 2;
	const endY = point.y + height / 2;

	const centerX = modifiedWidth / 2;
	const foliageHeight = height * 0.7;

	const fontSize = 20;
	const fontFamily = 'Arial';
	const fontWeight = 'bold';
	const currentText = "Actuel";
	const nearFutureText = "Futur proche";
	const futureText = "Futur";
	const textHeightOffset = height * 0.025;
	const lineWidth = 4;

	const tempText = new Text('', {
		fontSize: fontSize,
		fontFamily: fontFamily,
		fontWeight: fontWeight,
	});

	const { width: currentTextWidth } = TextMetrics.measureText(currentText, tempText.style);
	const { width: nearFutureTextWidth } = TextMetrics.measureText(nearFutureText, tempText.style);
	const { width: futureTextWidth } = TextMetrics.measureText(futureText, tempText.style);

	let maxLength: number;
	const diff = Math.abs(((height - modifiedWidth) / modifiedWidth) * 100) / 100;
	if (height < modifiedWidth) {
		maxLength = (height * (1 + Math.min(diff, 0.1))) / 2;
	} else {
		maxLength = Math.min(width, height) / 2;
	}

	return {
		typeId: 'frame',
		background: {
			typeId: 'framebox',
			properties: {
				cursor: 'pointer',
				eventMode: PixiEventMode.STATIC,
				color: 0xf00fff,
				alpha: 0.3,
				borderWidth: 0,
				borderColor: 0x000000,
			},
			bounds: {
				x: point.x - centerX,
				y: point.y - height / 2,
				width: modifiedWidth,
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

			{ //! Folliage
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
							color: 0x228b22,
							alpha: 0.2,
							borderWidth: 0,
							borderColor: 0x000000,
						},
						bounds: {
							x: point.x - (maxLength * 1.125),
							y: point.y - foliageHeight / 1.75,
							radius: modifiedWidth * 0.3,
							width: maxLength * 2.25,
							height: foliageHeight,
						},
					},
				],
			},
			{ //! Tree
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					eventMode: 'static',
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
					disabled: false,
				},
				childs: [
					{
						typeId: 'tree',
						properties: {
							cursor: 'none',
							eventMode: 'static',
							color: 0xffffff,
							borderWidth: 10,
							alpha: 1,
						},
						bounds: {
							x: startX,
							y: startY,
							width: modifiedWidth,
							height: height,
						},
					},
				],
			},
			{ //! small arc
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
							start: { x: startX + firstLineOffset + (lineWidth / 2) + firstLineOffset, y: endY - (lineWidth / 2) },
							end: { x: endX - firstLineOffset + (lineWidth / 2) - firstLineOffset, y: endY - (lineWidth / 2) },
							startControl: { x: startX + firstLineOffset + (lineWidth / 2) + firstLineOffset, y: startY + firstLineOffset * 1.5 - (lineWidth / 2) },
							endControl: { x: endX - firstLineOffset + (lineWidth / 2) - firstLineOffset, y: startY + firstLineOffset * 1.5 - (lineWidth / 2) },
						},
					},
				],
			},
			{ //! big arc
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
							start: { x: endX - modifiedWidth + (lineWidth / 2) + firstLineOffset, y: endY - (lineWidth / 2)},
							end: { x: endX + (lineWidth / 2) - firstLineOffset, y: endY - (lineWidth / 2)},
							startControl: { x: startX + (lineWidth / 2) + firstLineOffset, y: startY - (lineWidth / 2)},
							endControl: { x: startX + modifiedWidth + (lineWidth / 2) - firstLineOffset, y: startY - (lineWidth / 2)},
						},
					},
				],
			},
			{ //! First current Text
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
							color: 0xffffff,
							alpha: 1,
							text: currentText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: startX + (firstLineOffset * 2) + firstLineOffset / 2 - currentTextWidth / 2,
							y: endY - textHeightOffset,
						},
					},
				],
			},
			{ //! Second current Text
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
							color: 0xffffff,
							alpha: 1,
							text: currentText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: endX - (firstLineOffset * 2) - firstLineOffset / 2 - currentTextWidth / 2,
							y: endY - textHeightOffset,
						},
					},
				],
			},
			{ //! First near-future Text
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
							color: 0xffffff,
							alpha: 1,
							text: nearFutureText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: startX + firstLineOffset + firstLineOffset / 2 - nearFutureTextWidth / 2,
							y: endY - textHeightOffset,
						},
					},
				],
			},
			{ //! Second near-future Text
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
							color: 0xffffff,
							alpha: 1,
							text: nearFutureText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: endX - firstLineOffset - firstLineOffset / 2 - nearFutureTextWidth / 2,
							y: endY - textHeightOffset,
						},
					},
				],
			},
			{ //! First future Text
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
							color: 0xffffff,
							alpha: 1,
							text: futureText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: startX + firstLineOffset / 2 - futureTextWidth / 2,
							y: endY - textHeightOffset,
						},
					},
				],
			},
			{ //! Second future Text
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
							color: 0xffffff,
							alpha: 1,
							text: futureText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: endX - firstLineOffset / 2 - futureTextWidth / 2,
							y: endY - textHeightOffset,
						},
					},
				],
			},
		],
	};
};
