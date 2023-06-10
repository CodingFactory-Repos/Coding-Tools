import { Point } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { lowestNumberFinder } from '../utils/numberFinder';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { PixiEventMode } from '../types/pixi-enums';

export const elavatorPitch = (
	viewport: ViewportUI,
	point: Point,
	width: number,
	height: number,
): Partial<SerializedContainer> => {
	const allFrames = viewport.children.filter((ctn) => ctn instanceof FramedContainer);
	const frameNumbers = allFrames.map((frame) => frame.frameNumber);
	const frameNumber = lowestNumberFinder(frameNumbers);

	const maxWidth = Math.min(650, width);
	const maxHeight = Math.min(500, height);
	const startX = point.x - maxWidth / 2;
	const startY = point.y - maxHeight / 2;

	const pitchTemplate = [
		'Pour des (cients ciblés)...',
		'Qui ont un (besoin client)...',
		'Le (nom du produit)...',
		'Est une (catégorie de marché)...',
		'Qui apporte (un bénéfice clé)..',
		'A la différence de (la concurrence)...',
		"Le produit dispose d'un (critère de différence)...",
	];

	const fontSize = 23;
	const fontFamily = 'Arial';
	const fontWeight = '300';
	const textOffset = width * 0.0125;
	const elevatorPitchText = pitchTemplate.join('\n\n');

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
				width: maxWidth,
				height: maxHeight,
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
				//! Elvator pitch Text
				typeId: 'text',
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
						typeId: 'textarea',
						properties: {
							cursor: 'pointer',
							eventMode: 'static',
							color: 0x000000,
							alpha: 1,
							text: elevatorPitchText,
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: 'normal',
							fontFamily: fontFamily,
							fontPadding: 0,
							fontAlign: 'left',
							wordWrap: true,
							wordWrapWidth: maxWidth - textOffset * 2,
							breakWords: true,
						},
						bounds: {
							x: startX + textOffset,
							y: startY + textOffset,
						},
					},
				],
			},
		],
	};
};
