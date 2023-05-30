import { FramedContainer } from "../class/framedContainer";
import { GenericContainer } from "../class/genericContainer";
import { LineContainer } from "../class/lineContainer";
import { ViewportSocketPlugin } from "../plugins/viewportSocketPlugin";
import { ElementPosition } from "../types/pixi-container";
import { BezierHandle } from "../types/pixi-enums";
import { getLengthFromPoints } from "./lengthFromPoints";

export const dragAttachedLines = (container: GenericContainer | FramedContainer, socketPlugin: ViewportSocketPlugin) => {
	if (container?.linkedLinesUUID?.length > 0) {
		const containerUUID = container.uuid;
		const uuids = container.linkedLinesUUID;
		const { x, y, width, height } = container.getGeometry();

		for (let n = 0; n < uuids.length; n++) {
			//! This break the whole purpose of the plugin, but fuck it.
			const lineContainer = socketPlugin.elements[uuids[n]] as LineContainer;
			if (!lineContainer) continue;

			const line = lineContainer.children[0];
			const isStart = containerUUID === lineContainer?.startContainer?.containerUUID;
			const isEnd = containerUUID === lineContainer?.endContainer?.containerUUID;

			if (isStart) {
				const handleId = lineContainer.startContainer.handleId;
				let point: ElementPosition;

				if (handleId === BezierHandle.T) point = { x: x + width / 2, y: y };
				else if (handleId === BezierHandle.R) point = { x: x + width, y: y + height / 2 };
				else if (handleId === BezierHandle.L) point = { x: x, y: y + height / 2 };
				else if (handleId === BezierHandle.B) point = { x: x + width / 2, y: y + height };

				line.start = point;
				const lineLength = getLengthFromPoints(line.start, line.end);
				const startControl = { ...line.start };
				const endControl = { ...line.end };
				const angleControl = { ...line.end };

				if (handleId === BezierHandle.T) startControl.y -= lineLength;
				if (handleId === BezierHandle.R) startControl.x += lineLength;
				if (handleId === BezierHandle.L) startControl.x -= lineLength;
				if (handleId === BezierHandle.B) startControl.y += lineLength;

				if (lineContainer.endContainer.containerUUID !== undefined) {
					const handle = lineContainer.endContainer.handleId;

					if (handle === BezierHandle.T) endControl.y -= lineLength;
					else if (handle === BezierHandle.R) endControl.x += lineLength;
					else if (handle === BezierHandle.L) endControl.x -= lineLength;
					else if (handle === BezierHandle.B) endControl.y += lineLength;
					angleControl.x = line.end.x - endControl.x;
					angleControl.y = line.end.y - endControl.y;
				} else {
					angleControl.x = line.end.x - startControl.x;
					angleControl.y = line.end.y - startControl.y;
				}

				line.startControl = startControl;
				line.endControl = endControl;
				line.angleControl = angleControl;
				line.draw();
			}

			if (isEnd) {
				const handleId = lineContainer.endContainer.handleId;
				let point: ElementPosition;

				if (handleId === BezierHandle.T) point = { x: x + width / 2, y: y };
				else if (handleId === BezierHandle.R) point = { x: x + width, y: y + height / 2 };
				else if (handleId === BezierHandle.L) point = { x: x, y: y + height / 2 };
				else if (handleId === BezierHandle.B) point = { x: x + width / 2, y: y + height };

				line.end = point;
				const lineLength = getLengthFromPoints(line.start, line.end);
				const startControl = { ...line.start };
				const endControl = { ...line.end };
				const angleControl = { ...line.end };

				if (handleId === BezierHandle.T) endControl.y -= lineLength;
				if (handleId === BezierHandle.R) endControl.x += lineLength;
				if (handleId === BezierHandle.L) endControl.x -= lineLength;
				if (handleId === BezierHandle.B) endControl.y += lineLength;

				if (lineContainer.startContainer.containerUUID !== undefined) {
					const handle = lineContainer.startContainer.handleId;

					if (handle === BezierHandle.T) startControl.y -= lineLength;
					else if (handle === BezierHandle.R) startControl.x += lineLength;
					else if (handle === BezierHandle.L) startControl.x -= lineLength;
					else if (handle === BezierHandle.B) startControl.y += lineLength;
					angleControl.x = line.end.x - endControl.x;
					angleControl.y = line.end.y - endControl.y;
				} else {
					angleControl.x = line.end.x - endControl.x;
					angleControl.y = line.end.y - endControl.y;
				}

				line.startControl = startControl;
				line.endControl = endControl;
				line.angleControl = angleControl;
				line.draw();
			}

			socketPlugin.emit(
				'ws-line-updated',
				lineContainer.uuid,
				lineContainer.serializeControl(),
			);
		}
	}
};