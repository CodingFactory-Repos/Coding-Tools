import { FederatedPointerEvent } from 'pixi.js';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';

import { FramedContainer } from '@/lib/pixi-tools-v2/class/framedContainer';
import { SelectionBox } from '@/lib/pixi-tools-v2/class/selectionBox';
import { Normalizer } from '@/lib/pixi-tools-v2/class/normalyzer';
import { SerializedContainer } from '@/lib/pixi-tools-v2/types/pixi-serialize';
import type { ProjectStore } from '@/store/interfaces/project.interface';

export const useProjectStore = defineStore('project', {
	state: (): ProjectStore => {
		return {
			scene: null,
			canvas: null,
			default: true,
			deferredGeometry: null,
			selectionBox: null,
			onFullscreen: false,
			immersion: false,
			viewportDefaultPos: {},
			selectedFrameNumber: null,
		};
	},
	getters: {
		getZoom(this: ProjectStore) {
			return this.scene?.viewport?.zoomPlugin?.ZOOM?.value;
		},
		getFrames(this: ProjectStore) {
			return this.scene?.viewport?.activeFrames || [];
		},
	},
	actions: {
		setDeferredEvent(this: ProjectStore, cursor: CSSStyleProperty.Cursor, framed: boolean) {
			this.default = false;
			this.canvas.classList.toggle(cursor);
			this.removeGeometryEvent();

			const scene = toRaw(this.scene);
			scene.viewport.on('pointerup', framed ? this.createFramedGeometry : this.createGeometry);
		},
		removeGeometryEvent(this: ProjectStore) {
			// We remove all the event related to pointerup if they exist.
			// Know a better way to do it ? Be my guest.
			const scene = toRaw(this.scene);
			scene.viewport.off('pointerup', this.createFramedGeometry);
			scene.viewport.off('pointerup', this.createGeometry);
		},
		enableSelectionBox(this: ProjectStore, destroy = false) {
			if (destroy && this.selectionBox) {
				const selectionBox = toRaw(this.selectionBox);
				selectionBox.destroy();
				this.selectionBox = null;
				return;
			}

			if (!this.selectionBox) {
				const scene = toRaw(this.scene);
				this.selectionBox = new SelectionBox(scene.viewport);
			}
		},
		createFramedGeometry(this: ProjectStore, event: FederatedPointerEvent) {
			const scene = toRaw(this.scene);
			const point = scene.viewport.toWorld(event.global.clone());
			const data: Partial<SerializedContainer> = {
				typeId: 'frame',
				background: {
					typeId: 'framebox',
				},
			};
			const framedContainer = Normalizer.container(scene.viewport, data, false, point);
			scene.viewport.addChild(framedContainer);

			scene.viewport.off('pointerup', this.createFramedGeometry);
			this.canvas.classList.toggle('default');
			this.deferredGeometry = null;
			this.default = true;
		},
		createGeometry(this: ProjectStore, event: FederatedPointerEvent) {
			const scene = toRaw(this.scene);
			const point = scene.viewport.toWorld(event.global.clone());
			const data: Partial<SerializedContainer> = {
				typeId: 'generic',
				childs: [
					{
						typeId: this.deferredGeometry,
					},
				],
			};
			const genericContainer = Normalizer.container(scene.viewport, data, false, point);
			scene.viewport.addChild(genericContainer);

			if (this.selectedFrameNumber) {
				genericContainer.tabNumberContext = this.selectedFrameNumber;
			}

			scene.viewport.off('pointerup', this.createGeometry);
			this.canvas.classList.toggle('default');
			this.deferredGeometry = null;
			this.default = true;
		},
		increaseZoom(this: ProjectStore) {
			const scene = toRaw(this.scene);
			scene.viewport.zoomPlugin.updateZoomStep(1);
		},
		decreaseZoom(this: ProjectStore) {
			const scene = toRaw(this.scene);
			scene.viewport.zoomPlugin.updateZoomStep(-1);
		},
		toggleImmersion(this: ProjectStore) {
			this.immersion = !this.immersion;

			//! Hardcoded
			const offset = this.immersion ? 36 : 84;

			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight - offset;
			this.scene.heightOffset = offset;
			this.scene.renderer.resize(newWidth, newHeight);
			this.scene.viewport.screenHeight = newHeight;
			this.scene.viewport.worldHeight = newHeight;
		},
		setFrameCanvas(this: ProjectStore, frameNumber: number) {
			this.scene.viewport.toggleHidding(false, this.selectedFrameNumber);
			this.scene.viewport.children.find(
				(ctn) => ctn instanceof FramedContainer && ctn.frameNumber === frameNumber,
			).visible = true;
		},
		setDefaultCanvas(this: ProjectStore) {
			this.scene.viewport.toggleHidding(true);
		},
		canvasDownload(this: ProjectStore, mime: string) {
			const scene = toRaw(this.scene);
			scene.viewport.manager.downloadSelected(mime);
		},
	},
});
