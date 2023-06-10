import { Point } from 'pixi.js';
import { FramedContainer } from '../class/framedContainer';
import { lowestNumberFinder } from '../utils/numberFinder';
import { ViewportUI } from '../viewportUI';
import { SerializedContainer } from '../types/pixi-serialize';
import { PixiEventMode } from '../types/pixi-enums';
import { DeepPartial } from '@/interfaces/advanced-types.interface';

export interface PersonaBuilder {
	profile: {
		name: string;
		age: string;
		professionalBackground: string;
		personalSituation: string;
		motivation: string;
		bio: string;
		verbatism: string;
	}
	goals: Array<string>;
	needs: Array<string>;
	challenges: Array<string>;
	difficulties: Array<string>;
	skills: string;
	commentary: string;
}

export const personas = (
	viewport: ViewportUI,
	point: Point,
	width: number,
	height: number,
	personaBuilder?: DeepPartial<PersonaBuilder>,
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

	const threeFiveX = startX + width * (3 / 5);
	const oneFourX = startX + width * (1.25 / 4);
	const threeFourX = startX + width * (2.75 / 4);
	const largeZone = height * 0.4; // 100 - 40 * 2 = 20;

	const regularFontSize = 17;
	const bigFrontSize = 27;
	const regularFontFamily = 'Arial';
	const regularFontWeight = "300";
	const bigFontWeight = 'bold';
	const goalsTitleText = "Objectifs";
	const needsTitleText = "Besoins";
	const skillsTitleText = "Compétences";
	const difficultiesTitleText = "Difficultées";
	const challengesTitleText = "Challenges";
	const commentaryTitleText = "Commentaires";

	const lineWidth = 4;
	const textTitleOffset = width * 0.0125;
	const textDataOffset = width * 0.05;

	const textDefinition = {
		"age": "Age:",
		"personalSituation": "Situation personnel:",
		"motivation": "Motivation:",
		"professionalBackground": "Parcours professionnel:",
		"bio": "Biographie:",
		"verbatism": "Verbatism:",
	}

	const commentaryBuildText = personaBuilder.commentary?.replaceAll('\n', '');
	const skillsBuildText = personaBuilder.skills?.replaceAll('\n', '');
	const needBuildText = personaBuilder.needs.map((text) => text + '\n').join('\n');
	const goalBuildText = personaBuilder.goals.map((text) => text + '\n').join('\n');
	const challengeBuildText = personaBuilder.challenges.map((text) => text + '\n').join('\n');
	const difficultiesBuildText = personaBuilder.difficulties.map((text) => text + '\n').join('\n');

	const { name, ...values } = personaBuilder.profile;
	const profileBuildName = name;
	const profileBuildText = Object.keys(values).map((key) => {
		if(key === "verbatism") {
			return textDefinition[key] + " \"" + values[key] + '\"\n'
		} else {
			return textDefinition[key] + " " + values[key] + '\n'
		}
	}).join('\n');

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
			{ //! First -- line
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
			{ //! Section one | line
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
			{ //! Section two first | line
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
							end: { x: oneFourX, y: startY + largeZone * 2 + lineWidth / 2 },
							startControl: { x: oneFourX, y: startY + largeZone + lineWidth / 2 },
							endControl: { x: oneFourX, y: startY + largeZone * 2 + lineWidth / 2 },
						},
					},
				],
			},
			{ //! Section two second | line
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
							end: { x: threeFourX, y: startY + largeZone * 2 + lineWidth / 2 },
							startControl: { x: threeFourX, y: startY + largeZone + lineWidth / 2 },
							endControl: { x: threeFourX, y: startY + largeZone * 2 + lineWidth / 2 },
						},
					},
				],
			},
			{ //! Second -- line
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
			{ //! Section three -- line
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
			{ //! Name text
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
							text: profileBuildName,
							fontSize: bigFrontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "left"
						},
						bounds: {
							x: startX + textTitleOffset,
							y: startY + textTitleOffset,
						},
					},
				],
			},
			{ //! Profile Text
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
							text: profileBuildText,
							fontSize: 14,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "left",
							wordWrap: true,
							wordWrapWidth: (width * (3 / 5)) - (textTitleOffset * 2),
							breakWords: true
						},
						bounds: {
							x: startX + textTitleOffset,
							y: startY + textDataOffset,
						},
					},
				],
			},
			{ //! Needs text
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
							text: needsTitleText,
							fontSize: bigFrontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: threeFiveX + textTitleOffset,
							y: startY + textTitleOffset,
						},
					},
				],
			},
			{ //! Needs text Build
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
							text: needBuildText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "left",
							wordWrap: true,
							wordWrapWidth: (Math.abs(endX) - Math.abs(threeFiveX)) - (textTitleOffset * 2),
							breakWords: true
						},
						bounds: {
							x: threeFiveX + textTitleOffset,
							y: startY + textDataOffset,
						},
					},
				],
			},
			{ //! Goals text
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
							text: goalsTitleText,
							fontSize: bigFrontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: startX + textTitleOffset,
							y: startY + largeZone + lineWidth / 2 + textTitleOffset,
						},
					},
				],
			},
			{ //! Goals text Build
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
							text: goalBuildText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "left",
							wordWrap: true,
							wordWrapWidth: (Math.abs(endX) - Math.abs(threeFourX)) - (textTitleOffset * 2),
							breakWords: true
						},
						bounds: {
							x: startX + textTitleOffset,
							y: startY + largeZone + lineWidth / 2 + textDataOffset,
						},
					},
				],
			},
			{ //! Challenges text
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
							text: challengesTitleText,
							fontSize: bigFrontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: oneFourX + textTitleOffset,
							y: startY + largeZone + lineWidth / 2 + textTitleOffset,
						},
					},
				],
			},
			{ //! Challenges text Build
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
							text: challengeBuildText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "left",
							wordWrap: true,
							wordWrapWidth: (Math.abs(threeFourX) - Math.abs(oneFourX)) - (textTitleOffset * 2),
							breakWords: true
						},
						bounds: {
							x: oneFourX + textTitleOffset,
							y: startY + largeZone + lineWidth / 2 + textDataOffset,
						},
					},
				],
			},
			{ //! Difficulties text
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
							text: difficultiesTitleText,
							fontSize: bigFrontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: threeFourX + textTitleOffset,
							y: startY + largeZone + lineWidth / 2 + textTitleOffset,
						},
					},
				],
			},
			{ //! Difficulties text Build
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
							text: difficultiesBuildText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "left",
							wordWrap: true,
							wordWrapWidth: (Math.abs(endX) - Math.abs(threeFourX)) - (textTitleOffset * 2),
							breakWords: true
						},
						bounds: {
							x: threeFourX + textTitleOffset,
							y: startY + largeZone + lineWidth / 2 + textDataOffset,
						},
					},
				],
			},
			{ //! Skills text
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
							text: skillsTitleText,
							fontSize: bigFrontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: startX + textTitleOffset,
							y: point.y - halfHeight + largeZone * 2 + textTitleOffset,
						},
					},
				],
			},
			{ //! Skills text Build
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
							text: skillsBuildText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "left",
							wordWrap: true,
							wordWrapWidth: (width / 2) - (textTitleOffset * 2),
							breakWords: true
						},
						bounds: {
							x: startX + textTitleOffset,
							y: point.y - halfHeight + largeZone * 2 + textDataOffset,
						},
					},
				],
			},
			{ //!  Commentary Text
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
							text: commentaryTitleText,
							fontSize: bigFrontSize,
							fontWeight: bigFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "center"
						},
						bounds: {
							x: centerX + textTitleOffset,
							y: point.y - halfHeight + largeZone * 2 + textTitleOffset,
						},
					},
				],
			},
			{ //!  Commentary Text Build
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
							text: commentaryBuildText,
							fontSize: regularFontSize,
							fontWeight: regularFontWeight,
							fontStyle: "normal",
							fontFamily: regularFontFamily,
							fontPadding: 0,
							fontAlign: "left",
							wordWrap: true,
							wordWrapWidth: (width / 2) - (textTitleOffset * 2),
							breakWords: true
						},
						bounds: {
							x: centerX + textTitleOffset,
							y: point.y - halfHeight + largeZone * 2 + textDataOffset,
						},
					},
				],
			},
		],
	};
};
