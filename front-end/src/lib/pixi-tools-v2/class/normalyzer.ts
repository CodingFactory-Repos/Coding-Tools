import { Circle, LineBezier, Rectangle, TextArea } from '../model/template';
import { ViewportUI } from '../viewportUI';

import { ContainerType, GeometryTypes, PixiEventMode } from '../types/pixi-enums';
import type { ElementPosition } from '../types/pixi-container';
import {
	ContainerTypeId,
	GraphicTypeId,
	SerializedContainer,
	SerializedGraphic,
} from '../types/pixi-serialize';
import { generateUniqueId } from '../utils/uniqueId';
import { GenericContainer } from './genericContainer';
import { FramedContainer } from './framedContainer';
import { lowestNumberFinder } from '../utils/numberFinder';
import { LineContainer } from './lineContainer';
import { TextContainer } from './textContainer';

export class Normalizer {
	static graphic(data: Partial<SerializedGraphic>, position?: ElementPosition) {
		const Graphic = GeometryTypes[data.typeId as GraphicTypeId];
		const attributes = data as SerializedGraphic;

		if (!attributes.bounds && position) {
			if (Graphic === Circle) {
				const radius = 100;

				attributes.bounds = {
					x: position.x - radius,
					y: position.y - radius,
					radius,
				};
			} else if (Graphic === TextArea) {
				const width = 100; // Need to find a solution rather than hardcoded
				const height = 40; // Need to find a solution rather than hardcoded

				attributes.bounds = {
					x: position.x - width / 2,
					y: position.y - height / 2,
					width,
					height,
				};
			} else {
				const width = 200; // Need to find a solution rather than hardcoded
				const height = 200; // Need to find a solution rather than hardcoded

				attributes.bounds = {
					x: position.x - width / 2,
					y: position.y - height / 2,
					width,
					height,
				};
			}
		}

		if (Graphic === LineBezier && !attributes.lineControl) {
			const unset = { x: 0, y: 0 };
			attributes.lineControl = {
				start: unset,
				end: unset,
				startControl: unset,
				endControl: unset,
			};
		}

		if (!attributes.properties) {
			attributes.properties = {
				color: 0xffffff,
				cursor: 'pointer',
				eventMode: PixiEventMode.STATIC,
				alpha: 1,
				borderWidth: 0,
				borderColor: 0x000000,
			};

			if (Graphic === LineBezier) {
				attributes.properties.arrowHead = true;
				attributes.properties.dashed = false;
			}
		}

		attributes.uuid = attributes.uuid ?? generateUniqueId();
		return Graphic.registerGraphic(attributes);
	}

	static container(
		viewport: ViewportUI,
		data: Partial<SerializedContainer>,
		remote = false,
		position?: ElementPosition,
		tabContext?: number,
	) {
		if (data === null) return;
		const { childs, background, ...attr } = data;
		const Container = ContainerType[attr.typeId as ContainerTypeId];

		let backgroundChildren: Rectangle;
		const attributes = attr;
		const children = [];

		if (background) {
			backgroundChildren = this.graphic(background, position);
		}

		if (!attributes.anchors) {
			attributes.anchors = {
				absMinX: 0,
				absMinY: 0,
				absMaxX: 0,
				absMaxY: 0,
			};
		}

		if (!attributes.properties) {
			attributes.properties = {
				cursor: 'pointer',
				eventMode: PixiEventMode.STATIC,
				isAttachedToFrame: false,
				tabNumberContext: tabContext ?? -1,
				disabled: false,
			};
		}

		if (attributes.properties?.frameNumber === undefined) {
			const allFrames = viewport.children.filter((ctn) => ctn instanceof FramedContainer);
			const frameNumbers = allFrames.map((frame) => frame.frameNumber);
			const frameNumber = attr.typeId === 'frame' ? lowestNumberFinder(frameNumbers) : -1;

			attributes.properties.frameNumber = frameNumber;
		}

		if (childs !== undefined) {
			for (const element of childs) {
				const childTypeId = element.typeId;

				if (
					childTypeId === 'generic' ||
					childTypeId === 'frame' ||
					childTypeId === 'line' ||
					childTypeId === 'text'
				) {
					const containerChildren = this.container(
						viewport,
						element as SerializedContainer,
						remote,
						position,
						tabContext,
					);
					children.push(containerChildren);
				} else {
					const graphicChildren = this.graphic(element as SerializedGraphic, position);
					children.push(graphicChildren);
				}
			}
		}

		attributes.uuid = attributes.uuid ?? generateUniqueId();
		if (
			Container === GenericContainer ||
			Container === LineContainer ||
			Container === TextContainer
		)
			return Container.registerContainer(viewport, attributes, children, remote);
		else if (Container === FramedContainer)
			return Container.registerContainer(
				viewport,
				attributes,
				children,
				remote,
				backgroundChildren,
			);
	}
}
