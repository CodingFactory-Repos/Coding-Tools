import { Point } from "pixi.js";
import { FramedContainer } from "../class/framedContainer";
import { lowestNumberFinder } from "../utils/numberFinder";
import { ViewportUI } from "../viewportUI";

export const empathyMap = (viewport: ViewportUI, point: Point, width: number, height: number) => {
	const allFrames = viewport.children.filter((ctn) => ctn instanceof FramedContainer);
	const frameNumbers = allFrames.map((frame) => frame.frameNumber);
	const frameNumber = lowestNumberFinder(frameNumbers);

	const centerX = width / 2;
	const centerY = height / 2;
	const largeZone = height * 0.38; // 100 - 38 * 2 = 24;
	const smallZone = height * 0.24;
	const circleRadius = width / 6;

	return {
		typeId: 'frame',
		background: {
			typeId: 'framebox',
			properties: {
				cursor: 'pointer',
				interactive: true,
				color: 0xFFFFFF,
				alpha: 0,
			},
			bounds: {
				x: point.x - centerX,
				y: point.y - height / 2,
				width,
				height,
			}
		},
		properties: {
			cursor: 'pointer',
			interactive: true,
			tabNumberContext: -1,
			isAttachedToFrame: false,
			frameNumber: frameNumber
		},
		childs: [
			/************************************************************************
				Edge rectangles of the empathy map (SAYS&DO, THINK&FEEL, SEE, HEAR)
			 ************************************************************************/

			// Edge rectangle [SAYS&DO]
			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					interactive: false,
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
				},
				childs: [
					{
						typeId: 'rectangle',
						properties: {
							cursor: 'pointer',
							interactive: false,
							color: 0xFFFFFF,
							alpha: 1,
						},
						bounds: {
							x: point.x - centerX,
							y: point.y - centerY,
							width: centerX,
							height: largeZone,
						}
					},
				]
			},

			// Edge rectangle [THINK&FEEL]
			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					interactive: false,
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
				},
				childs: [
					{
						typeId: 'rectangle',
						properties: {
							cursor: 'pointer',
							interactive: false,
							color: 0xFFFFFF,
							alpha: 1,
						},
						bounds: {
							x: point.x,
							y: point.y - centerY,
							width: centerX,
							height: largeZone,
						}
					}
				]
			},

			// Edge rectangle [SEE]
			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					interactive: false,
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
				},
				childs: [
					{
						typeId: 'rectangle',
						properties: {
							cursor: 'pointer',
							interactive: false,
							color: 0xFFFFFF,
							alpha: 1,
						},
						bounds: {
							x: point.x - centerX,
							y: point.y - centerY + largeZone,
							width: centerX,
							height: largeZone,
						}
					}
				]
			},

			// Edge rectangle [HEAR]
			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					interactive: false,
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
				},
				childs: [
					{
						typeId: 'rectangle',
						properties: {
							cursor: 'pointer',
							interactive: false,
							color: 0xFFFFFF,
							alpha: 1,
						},
						bounds: {
							x: point.x,
							y: point.y - centerY + largeZone,
							width: centerX,
							height: largeZone,
						}
					}
				]
			},

			/****************************************************
				Bottom rectangles of the empathy map (PAIN, GAIN)
			 ****************************************************/

			// Bottom rectangle [PAIN]
			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					interactive: false,
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
				},
				childs: [
					{
						typeId: 'rectangle',
						properties: {
							cursor: 'pointer',
							interactive: false,
							color: 0xCFD1D0,
							alpha: 1,
						},
						bounds: {
							x: point.x - centerX,
							y: point.y - centerY + (largeZone * 2),
							width: centerX,
							height: smallZone,
						}
					}
				]
			},

			// Bottom rectangle [GAIN]
			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					interactive: false,
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
				},
				childs: [
					{
						typeId: 'rectangle',
						properties: {
							cursor: 'pointer',
							interactive: false,
							color: 0xCFD1D0,
							alpha: 1,
						},
						bounds: {
							x: point.x,
							y: point.y - centerY + (largeZone * 2),
							width: centerX,
							height: smallZone,
						}
					}
				]
			},

			/******************************************
				Center circle of the empathy map (USER)
			 ******************************************/

			// Centered Circle [USER]
			{
				typeId: 'generic',
				properties: {
					cursor: 'pointer',
					interactive: false,
					tabNumberContext: frameNumber,
					isAttachedToFrame: true,
					frameNumber: frameNumber,
				},
				childs: [
					{
						typeId: 'circle',
						properties: {
							cursor: 'pointer',
							interactive: false,
							color: 0xFFFFFF,
							alpha: 1,
						},
						bounds: {
							x: point.x - circleRadius,
							y: point.y - centerY + largeZone - circleRadius,
							radius: circleRadius,
						}
					}
				]
			}
		]
	}
}