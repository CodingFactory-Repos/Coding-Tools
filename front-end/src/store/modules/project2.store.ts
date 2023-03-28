import { FramedContainer } from './../../lib/pixi-tools-v2/class/framedContainer';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';

import { ProjectStorev2 } from '@/store/interfaces/projectv2.interface';
import { Normalizer } from '@/lib/pixi-tools-v2/class/normalyzer';
import { GenericContainer } from '@/lib/pixi-tools-v2/class/genericContainer';
import { SelectionBox } from '@/lib/pixi-tools-v2/class/selectionBox';

export const useProjectStorev2 = defineStore('projectv2', {
	state: (): ProjectStorev2 => {
		return {
			scene: null,
			canvas: null,
			default: true,
			deferredGeometry: null,
			selectionBox: null,
		};
	},
	getters: {

	},
	actions: {
		setDeferredEvent(
			this: ProjectStorev2,
			cursor: CSStyleProperty.Cursor,
			framed: boolean
		) {
			this.default = false;
			this.canvas.classList.toggle(cursor);

			// We remove all the event related to pointerup if they exist.
			// Know a better way to do it ? Be my guest.
			this.canvas.removeEventListener('pointerup', this.createFramedGeometry);
			this.canvas.removeEventListener('pointerup', this.createGeometry);

			this.canvas.addEventListener('pointerup', framed ? this.createFramedGeometry : this.createGeometry);
		},
		toggleDefaultCanvasMode(this: ProjectStorev2, destroy: boolean = false) {
			if(destroy && this.selectionBox) {
				this.selectionBox.destroy();
				this.selectionBox = null;
				return;
			}

			if (!this.selectionBox) {
				this.selectionBox = new SelectionBox(toRaw(this.scene));
			}
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
			this.default = true;
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
			this.default = true;
		}
	},
});
