import { Point, TextMetrics, Text } from 'pixi.js';
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
	const smallZone = height * 0.24;
	const circleRadius = width / 9;

	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const quarterWidth = width / 4;
	const startX = point.x - halfWidth;
	const startY = point.y - halfHeight;
	const endX = point.x + halfWidth;
	const endY = point.y + halfHeight;
	const lineWidth = 4;

	const regularFontSize = 20;
	const bigFontSize = 27;
	const fontFamily = 'Arial';
	const bigFontWeight = 'bold';
	const regularFontWeight = "300";
	const questionText = "Qu'est-ce qu'il/elle";
	const thinkAndFeelText = "PENSE & RESSENT";
	const thinkAndFeelDetailText = "Ce qui compte vraiment\nLes principales préoccupations\nInquiétudes et aspirations";
	const seeText = "VOIT";
	const seeDetailText = "Environnement\nCe que les amis font\nCe que le marché offre";
	const hearText = "ENTEND";
	const hearDetailText = "Ce que disent les amis\nCe que dit le patron\nCe que disent les influenceurs\n";
	const sayAndDoText = "DIT & FAIT";
	const sayAndDoDetailText = "Attitude en public\nApparence\nComportement envers les autres";
	const painText = "SOUFFRANCE";
	const painDetailText = "Peurs, frustrations, obstacles";
	const valueText = "INTÉRÊT"
	const valueDetailText =  "Désirs / besoins, mesures de succès";

	const textGap = width * 0.005;
	const textWidthOffset = width * 0.125;
	const textSideOffset = height * 0.185;
	const textHeightOffset = height * 0.025;

	const regularTempText = new Text('', {
		fontSize: regularFontSize,
		fontFamily: fontFamily,
		fontWeight: regularFontWeight,
	});

	const bigTempText = new Text('', {
		fontSize: bigFontSize,
		fontFamily: fontFamily,
		fontWeight: bigFontWeight,
	});

	const { width: questionTextWidth, height: questionTextHeight } = TextMetrics.measureText(questionText, regularTempText.style);
	const { width: thinkAndFeelTextWidth, height: thinkAndFeelTextHeight } = TextMetrics.measureText(thinkAndFeelText, bigTempText.style);
	const { width: thinkAndFeelDetailTextWidth } = TextMetrics.measureText(thinkAndFeelDetailText, regularTempText.style);

	const { width: seeTextWidth, height: seeTextHeight } = TextMetrics.measureText(seeText, bigTempText.style);
	const { width: seeDetailTextWidth }= TextMetrics.measureText(seeDetailText, regularTempText.style);

	const { width: hearTextWidth, height: hearTextHeight } = TextMetrics.measureText(hearText, bigTempText.style);
	const { width: hearDetailTextWidth } = TextMetrics.measureText(hearDetailText, regularTempText.style);

	const { width: sayAndDoTextWidth, height: sayAndDoTextHeight } = TextMetrics.measureText(sayAndDoText, bigTempText.style);
	const { width: sayAndDoDetailTextWidth } = TextMetrics.measureText(sayAndDoDetailText, regularTempText.style);

	const { width: painTextWidth, height: painTextHeight } = TextMetrics.measureText(painText, bigTempText.style);
	const { width: painDetailTextWidth } = TextMetrics.measureText(painDetailText, regularTempText.style);

	const { width: valueTextWidth, height: valueTextHeight } = TextMetrics.measureText(valueText, bigTempText.style);
	const { width: valueDetailTextWidth } = TextMetrics.measureText(valueDetailText, regularTempText.style);

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
			{ //! only \ line
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
			{ //! only / line
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
			{ //! only | line
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
							start: { x: startX + lineWidth / 2, y: point.y - centerY + largeZone * 2 },
							end: { x: endX - lineWidth / 2, y: point.y - centerY + largeZone * 2 },
							startControl: { x: startX + lineWidth / 2, y: point.y - centerY + largeZone * 2 },
							endControl: { x: endX - lineWidth / 2, y: point.y - centerY + largeZone * 2 },
						},
					},
				],
			},
			{ //! circle
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
//! --------------
//! THINK & FEEL
//! --------------
			{
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
							text: questionText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: point.x - questionTextWidth / 2,
							y: startY + textHeightOffset,
						},
					},
				],
			},
			{
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
							text: thinkAndFeelText,
							fontSize: bigFontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: point.x - thinkAndFeelTextWidth / 2,
							y: startY + textHeightOffset + questionTextHeight + textGap,
						},
					},
				],
			},
			{
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
							text: thinkAndFeelDetailText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: point.x - thinkAndFeelDetailTextWidth / 2,
							y: startY + textHeightOffset + questionTextHeight + thinkAndFeelTextHeight + textGap * 2,
						},
					},
				],
			},
//! --------------
//! SEE
//! --------------
			{
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
							text: questionText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: endX - textWidthOffset - questionTextWidth / 2,
							y: point.y - textSideOffset,
						},
					},
				],
			},
			{
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
							text: seeText,
							fontSize: bigFontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: endX - textWidthOffset - seeTextWidth / 2,
							y: point.y - textSideOffset + questionTextHeight + textGap,
						},
					},
				],
			},
			{
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
							text: seeDetailText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: endX - textWidthOffset - seeDetailTextWidth / 2,
							y: point.y - textSideOffset + questionTextHeight + seeTextHeight + textGap * 2,
						},
					},
				],
			},
//! --------------
//! SAY & DO
//! --------------
			{
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
							text: questionText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: point.x - questionTextWidth / 2,
							y: (point.y - centerY + largeZone * 1.6) - textHeightOffset,
						},
					},
				],
			},
			{
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
							text: sayAndDoText,
							fontSize: bigFontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: point.x - sayAndDoTextWidth / 2,
							y: (point.y - centerY + largeZone * 1.6) - textHeightOffset + questionTextHeight + textGap,
						},
					},
				],
			},
			{
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
							text: sayAndDoDetailText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: point.x - sayAndDoDetailTextWidth / 2,
							y: (point.y - centerY + largeZone * 1.6) - textHeightOffset + questionTextHeight + sayAndDoTextHeight + textGap * 2,
						},
					},
				],
			},
//! --------------
//! HEAR
//! --------------
			{
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
							text: questionText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: startX + textWidthOffset - questionTextWidth / 2,
							y: point.y - textSideOffset,
						},
					},
				],
			},
			{
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
							text: hearText,
							fontSize: bigFontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: startX + textWidthOffset - hearTextWidth / 2,
							y: point.y - textSideOffset + questionTextHeight + textGap,
						},
					},
				],
			},
			{
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
							text: hearDetailText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: startX + textWidthOffset - hearDetailTextWidth / 2,
							y: point.y - textSideOffset + questionTextHeight + hearTextHeight + textGap * 2,
						},
					},
				],
			},
//! --------------
//! PAIN
//! --------------
			{
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
							text: questionText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: point.x - quarterWidth - questionTextWidth / 2,
							y: endY - (smallZone / 1.5),
						},
					},
				],
			},
			{
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
							text: painText,
							fontSize: bigFontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: point.x - quarterWidth - painTextWidth / 2,
							y: endY - (smallZone / 1.5) + questionTextHeight + textGap,
						},
					},
				],
			},
			{
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
							text: painDetailText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: point.x - quarterWidth - painDetailTextWidth / 2,
							y: endY - (smallZone / 1.5) + questionTextHeight + painTextHeight + textGap * 2,
						},
					},
				],
			},
//! --------------
//! VALUE
//! --------------
			{
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
							text: questionText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: point.x + quarterWidth - questionTextWidth / 2,
							y: endY - (smallZone / 1.5),
						},
					},
				],
			},
			{
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
							text: valueText,
							fontSize: bigFontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
						},
						bounds: {
							x: point.x + quarterWidth - valueTextWidth / 2,
							y: endY - (smallZone / 1.5) + questionTextHeight + textGap,
						},
					},
				],
			},
			{
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
							text: valueDetailText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: fontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: point.x + quarterWidth - valueDetailTextWidth / 2,
							y: endY - (smallZone / 1.5) + questionTextHeight + valueTextHeight + textGap * 2,
						},
					},
				],
			},
		],
	};
};
