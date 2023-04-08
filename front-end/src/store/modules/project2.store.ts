import { FederatedPointerEvent } from 'pixi.js';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';

import { GenericContainer } from '@/lib/pixi-tools-v2/class/genericContainer';
import { FramedContainer } from '@/lib/pixi-tools-v2/class/framedContainer';
import { SelectionBox } from '@/lib/pixi-tools-v2/class/selectionBox';
import { Normalizer } from '@/lib/pixi-tools-v2/class/normalyzer';

import type { ProjectStorev2 } from '@/store/interfaces/projectv2.interface';

export const useProjectStorev2 = defineStore('projectv2', {
	state: (): ProjectStorev2 => {
		return {
			scene: null,
			canvas: null,
			default: true,
			deferredGeometry: null,
			selectionBox: null,
			onFullscreen: false,
			immersion: false,
			frames: [],
			viewportDefaultPos: {},
		};
	},
	getters: {
		getZoom(this: ProjectStorev2) {
			return this.scene?.viewport?.zoomPlugin?.ZOOM?.value;
		},
	},
	actions: {
		setDeferredEvent(
			this: ProjectStorev2,
			cursor: CSSStyleProperty.Cursor,
			framed: boolean
		) {
			this.default = false;
			this.canvas.classList.toggle(cursor);
			this.removeGeometryEvent()

			const scene = toRaw(this.scene);
			scene.viewport.on('pointerup', framed ? this.createFramedGeometry : this.createGeometry);
		},
		removeGeometryEvent(this: ProjectStorev2) {
			// We remove all the event related to pointerup if they exist.
			// Know a better way to do it ? Be my guest.
			const scene = toRaw(this.scene);
			scene.viewport.off('pointerup', this.createFramedGeometry);
			scene.viewport.off('pointerup', this.createGeometry);
		},
		enableSelectionBox(this: ProjectStorev2, destroy: boolean = false) {
			if(destroy && this.selectionBox) {
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
		createFramedGeometry(
			this: ProjectStorev2,
			event: FederatedPointerEvent
		) {
			const scene = toRaw(this.scene);
			const normalizer = new Normalizer(scene.stage, scene.viewport);
			const point = scene.viewport.toWorld(event.global.clone());
			
			const context = normalizer.normalizeOneGraphic({
				...point,
				geometry: this.deferredGeometry,
				color: 0xffffff,
			}, true);

			context.manager = scene.viewport.manager;
			const framedContainer = new FramedContainer(context);
			scene.viewport.addChild(framedContainer);

			scene.viewport.off('pointerup', this.createFramedGeometry);
			this.canvas.classList.toggle("default");
			this.frames.push(framedContainer);
			this.deferredGeometry = null;
			this.default = true;
		},
		createGeometry(
			this: ProjectStorev2,
			event: FederatedPointerEvent
		) {
			const scene = toRaw(this.scene);
			const normalizer = new Normalizer(scene.stage, scene.viewport);
			const point = scene.viewport.toWorld(event.global.clone());
			
			const context = normalizer.normalizeOneGraphic({
				...point,
				geometry: this.deferredGeometry,
				color: 0xffffff,
			}, false);

			context.manager = scene.viewport.manager;
			const genericContainer = new GenericContainer(context, {
				isAttached: false,
				to: -1
			});
			scene.viewport.addChild(genericContainer);

			scene.viewport.off('pointerup', this.createGeometry);
			this.canvas.classList.toggle("default");
			this.deferredGeometry = null;
			this.default = true;
		},
		increaseZoom(this: ProjectStorev2) {
			this.scene.viewport.zoomPlugin.updateZoomStep(1);
		},
		decreaseZoom(this: ProjectStorev2) {
			this.scene.viewport.zoomPlugin.updateZoomStep(-1);
		},
		toggleImmersion(this: ProjectStorev2) {
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
		setFrameCanvas(this: ProjectStorev2, index: number) {
			this.scene.viewport.toggleHidding(false);
			this.frames[index].visible = true;
		},
		setDefaultCanvas(this: ProjectStorev2) {
			this.scene.viewport.toggleHidding(true);
		}
	},
});
