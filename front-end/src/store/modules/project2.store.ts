import { FramedContainer } from './../../lib/pixi-tools-v2/class/framedContainer';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';

import { ProjectStorev2 } from '@/store/interfaces/projectv2.interface';
import { Normalizer } from '@/lib/pixi-tools-v2/class/normalyzer';
import { GenericContainer } from '@/lib/pixi-tools-v2/class/genericContainer';

export const useProjectStorev2 = defineStore('projectv2', {
	state: (): ProjectStorev2 => {
		return {
			scene: null,
			canvas: null,
			deferredGeometry: null,
		};
	},
	actions: {
		setDeferredEvent(
			this: ProjectStorev2,
			cursor: CSStyleProperty.Cursor,
			framed: boolean
		) {
			this.canvas.classList.toggle(cursor);
			this.canvas.addEventListener('pointerup', framed ? this.createFramedGeometry : this.createGeometry);
		},
		createFramedGeometry(
			this: ProjectStorev2,
			event: PointerEvent
		) {
			const scene = toRaw(this.scene);
			const normalizer = new Normalizer(scene.stage, scene.viewport);
			
			const context = normalizer.normalizeOneGraphic({
				geometry: this.deferredGeometry,
				clientX: event.clientX,
				clientY: event.clientY,
				color: 0xffffff,
			}, true);

			context.manager = scene.manager;
			const framedContainer = new FramedContainer(context);
			scene.viewport.addChild(framedContainer);
			this.scene = scene;

			this.canvas.classList.toggle("default");
			this.deferredGeometry = null;
			this.canvas.removeEventListener('pointerup', this.createFramedGeometry);
		},
		createGeometry(
			this: ProjectStorev2,
			event: PointerEvent
		) {
			const scene = toRaw(this.scene);
			const normalizer = new Normalizer(scene.stage, scene.viewport);
			
			const context = normalizer.normalizeOneGraphic({
				geometry: this.deferredGeometry,
				clientX: event.clientX,
				clientY: event.clientY,
				color: 0xffffff,
			}, false);

			context.manager = scene.manager;
			const genericContainer = new GenericContainer(context, {
				isAttached: false,
				to: -1
			});
			scene.viewport.addChild(genericContainer);
			this.scene = scene;

			this.canvas.classList.toggle("default");
			this.deferredGeometry = null;
			this.canvas.removeEventListener('pointerup', this.createGeometry);
		}
	},
});
