import { FederatedPointerEvent, Renderer } from 'pixi.js';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';

import { FramedContainer } from '@/lib/pixi-tools-v2/class/framedContainer';
import { SelectionBox } from '@/lib/pixi-tools-v2/class/selectionBox';
import { Normalizer } from '@/lib/pixi-tools-v2/class/normalyzer';
import { SerializedContainer } from '@/lib/pixi-tools-v2/types/pixi-serialize';
import type { FramedPDF, ProjectStore } from '@/store/interfaces/project.interface';
import { KeysRequired } from '@/interfaces/advanced-types.interface';
import { pick } from '@/utils/object.helper';
import { getAgileBlueprints } from '@/store/interfaces/agility.interface';

const projectStoreDefaultState = (): ProjectStore => ({
	scene: null,
	canvas: null,
	default: true,
	deferredGeometry: null,
	deferredContainer: null,
	deferredBlueprint: null,
	selectionBox: null,
	onFullscreen: false,
	immersion: false,
	viewportDefaultPos: {},
	selectedFrameNumber: null,
	pdfViewerOpen: false,
	refreshPdfViewer: 0,
	timerId: null,
});

export const useProjectStore = defineStore('project', {
	state: (): ProjectStore => projectStoreDefaultState(),
	getters: {
		getZoom(this: ProjectStore) {
			return this.scene?.viewport?.zoomPlugin?.ZOOM?.value;
		},
		getFrames(this: ProjectStore) {
			return this.scene?.viewport?.activeFrames || [];
		},
		getSelected(this: ProjectStore) {
			return this.scene?.viewport?.manager?.selectedContainers || [];
		},
		getImages(this: ProjectStore) {
			if(!this.pdfViewerOpen) return [];
			this.refreshPdfViewer;

			const frames = this.scene?.viewport?.childFrames || [];
			const len = frames.length;

			const reactiveImages: Array<FramedPDF> = [];
			for(let n = 0; n < len; n++) {
				const container = frames[n];
				const { width, height } = container;
				const cloneContainer = container.cloneToContainer();
				const { x, y } = cloneContainer.getBounds();
				cloneContainer.position.set(-x, -y);

				const renderer = new Renderer({ resolution: devicePixelRatio + 1, width: height, height: width, backgroundAlpha: 0 });
				renderer.render(cloneContainer);

				const canvas = renderer.view;
				const imageData = canvas.toDataURL('image/png');

				reactiveImages.push({
					id: container.uuid,
					order: n + 1,
					base64: imageData,
					dimension: {
						width: Math.floor(width),
						height: Math.floor(height),
					}
				});

				cloneContainer.destroy();
				renderer.destroy();
			}

			return reactiveImages;
		}
	},
	actions: {
		startRefreshing(this: ProjectStore) {
			if (this.timerId) {
				clearInterval(this.timerId);
				this.timerId = null;
			}

			this.timerId = setInterval(() => {
				this.refreshPdfViewer++;
				this.startRefreshing();
			}, 10000);
		},
		stopRefreshing(this: ProjectStore) {
			if (this.timerId) {
				clearInterval(this.timerId);
				this.timerId = null;
			}

			this.refreshPdfViewer = 0;
		},
		setDeferredEvent(this: ProjectStore, cursor: CSSStyleProperty.Cursor, framed: boolean) {
			this.default = false;
			this.canvas.classList.toggle(cursor);
			this.removeGeometryEvent();

			const scene = toRaw(this.scene);
			scene.viewport.on('pointerup', framed ? this.createFramedGeometry : this.createGeometry);
		},
		setBlueprintEvent(this: ProjectStore, cursor: CSSStyleProperty.Cursor) {
			this.default = false;
			this.canvas.classList.toggle(cursor);
			this.removeGeometryEvent();

			const scene = toRaw(this.scene);
			scene.viewport.on('pointerup', this.createBlueprint);
		},
		setTextEvent(this: ProjectStore, cursor: CSSStyleProperty.Cursor) {
			this.default = false;
			this.canvas.classList.toggle(cursor);
			this.removeGeometryEvent();

			const scene = toRaw(this.scene);
			scene.viewport.on('pointerup', this.createGeometry);
		},
		removeGeometryEvent(this: ProjectStore) {
			// We remove all the event related to pointerup if they exist.
			// Know a better way to do it ? Be my guest.
			const scene = toRaw(this.scene);
			scene.viewport.off('pointerup', this.createFramedGeometry);
			scene.viewport.off('pointerup', this.createGeometry);
			scene.viewport.off('pointerup', this.createBlueprint);
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
				typeId: this.deferredContainer,
				childs: [
					{
						typeId: this.deferredGeometry,
					},
				],
			};
			const genericContainer = Normalizer.container(
				scene.viewport,
				data,
				false,
				point,
				this.selectedFrameNumber,
			);
			scene.viewport.addChild(genericContainer);

			scene.viewport.off('pointerup', this.createGeometry);
			this.canvas.classList.toggle('default');
			this.deferredGeometry = null;
			this.deferredContainer = null;
			this.default = true;
		},
		createBlueprint(this: ProjectStore, event: FederatedPointerEvent) {
			const scene = toRaw(this.scene);
			const point = scene.viewport.toWorld(event.global.clone());
			const generateBlueprint: Function | null = getAgileBlueprints[this.deferredBlueprint];
			if (generateBlueprint === null) return;

			const data = generateBlueprint(
				scene.viewport,
				point,
				1200,
				900,
			) as Partial<SerializedContainer>;

			const framedContainer = Normalizer.container(scene.viewport, data, true, point);
			this.scene.viewport.socketPlugin.emit('ws-element-added', framedContainer.serializeData());
			scene.viewport.addChild(framedContainer);

			scene.viewport.off('pointerup', this.createBlueprint);
			this.canvas.classList.toggle('default');
			this.deferredBlueprint = null;
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
			this.scene.viewport.activeFrameNumber = frameNumber;
			this.scene.viewport.toggleHidding(false, this.selectedFrameNumber);
			this.scene.viewport.children.find(
				(ctn) => ctn instanceof FramedContainer && ctn.frameNumber === frameNumber,
			).visible = true;
		},
		setDefaultCanvas(this: ProjectStore) {
			this.scene.viewport.activeFrameNumber = null;
			this.scene.viewport.toggleHidding(true);
		},
		canvasDownload(this: ProjectStore, mime: string) {
			const scene = toRaw(this.scene);
			scene.viewport.manager.downloadSelected(mime);
		},
		reset(this: ProjectStore, keys?: Array<KeysRequired<ProjectStore>>) {
			Object.assign(
				this,
				keys?.length ? pick(projectStoreDefaultState(), keys) : projectStoreDefaultState(), // if no keys provided, reset all
			);
		},
	},
});
