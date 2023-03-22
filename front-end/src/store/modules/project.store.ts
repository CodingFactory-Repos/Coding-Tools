import { defineStore } from 'pinia';

import { ProjectStore, Target } from '@/store/interfaces/project.interface';
import { StickyNote } from '@/lib/pixi-tools/models/stickyNote';
import { toRaw } from 'vue';
import { PixiObject, PixiObjectPluggin } from '@/lib/pixi-tools/types';
import { TextBox } from '@/lib/pixi-tools/models/textBox';

const DEFAULT_ACTION = {
	cursor: 'inherit',
	target: Target.DEFAULT,
};

function round(value: number, precision?: number) {
	if(value === undefined) return 1;
	const multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

export const useProjectStore = defineStore('project', {
	state: (): ProjectStore => {
		return {
			fullscreen: false,
			scene: undefined,
			canvas: undefined,
			action: DEFAULT_ACTION,
			meta: {
				title: 'ProjectName 1',
				description: '',
				owner: 'You',
				createdAt: new Date().toLocaleDateString(),
				updatedAt: new Date().toLocaleDateString(),
			},
			viewportBounds: {
				posX: undefined,
				posY: undefined,
				scaleX: undefined,
				scaleY: undefined,
			},
		};
	},
	getters: {
		getZoom(this: ProjectStore) {
			const zoom = this.scene?.zoom?.value;
			if(zoom > 1) {
				return round(zoom);
			} else {
				return round(zoom, 1);
			}
		},
	},
	actions: {
		increaseZoom(this: ProjectStore) {
			this.scene.updateZoomStep(1);
		},
		decreaseZoom(this: ProjectStore) {
			this.scene.updateZoomStep(0);
		},
		setAction(this: ProjectStore, cursor: string, target: number) {
			this.updateCursor(cursor);
			this.action = { cursor, target };
			this.canvas.addEventListener('pointerup', this._createCanvasElement);
		},
		updateCursor(this: ProjectStore, cursor: string) {
			this.canvas.classList.toggle(this.action.cursor);
			this.canvas.classList.toggle(cursor);
		},
		activateFocusMode(this: ProjectStore) {
			const focusedElement = this.scene.viewport.children.find(
				(el: PixiObject & PixiObjectPluggin) => el.isSelected === true,
			) as PixiObject & PixiObjectPluggin;
			if (focusedElement === undefined) return false;

			const vp = this.scene.viewport;
			focusedElement.isFocused = true;

			// Resize the windows height for the focused mode
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight - 100;
			this.scene.renderer.resize(newWidth, newHeight);
			vp.screenHeight = newHeight;
			vp.worldHeight = newHeight;

			// Disable pluggins
			focusedElement.dragPlugin.disableDragging();
			focusedElement.selectPlugin.disableSelect();
			vp.plugins.get('drag').pause();
			vp.plugins.get('wheel').pause();
			vp.plugins.get('pinch').pause();

			// Retrieve focused element bounds
			const bounds = focusedElement.getBounds();
			const localBounds = focusedElement.getLocalBounds();

			// Store wiewport data before focus
			this.viewportBounds.scaleX = vp.scale.x;
			this.viewportBounds.scaleY = vp.scale.y;
			this.viewportBounds.posX = vp.x;
			this.viewportBounds.posY = vp.y;

			// Hide all other elements
			for (const child of vp.children) {
				if (child !== focusedElement) child.visible = false;
			}

			// Calculate and set the center of the focused element at the viewport level
			const boundsCenterX = bounds.x + bounds.width / 2;
			const boundsCenterY = bounds.y + bounds.height / 2;
			const vpCenterX = vp.x + (vp.screenWidth / 2 - boundsCenterX);
			const vpCenterY = vp.y + (vp.screenHeight / 2 - boundsCenterY);
			vp.position.set(vpCenterX, vpCenterY);

			// Fit the focused element to the viewport height
			vp.fit(true, localBounds.width, localBounds.height);

			// dirty
			vp.plugins.reset();
			vp.dirty = true;
			return true;
		},
		deactivateFocusMode(this: ProjectStore) {
			const focusedElement = this.scene.viewport.children.find(
				(el: PixiObject & PixiObjectPluggin) => el.isFocused,
			) as PixiObject & PixiObjectPluggin;

			const vp = this.scene.viewport;

			// Resize the windows height for the scene mode
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;
			this.scene.renderer.resize(newWidth, newHeight);
			vp.screenHeight = newHeight;
			vp.worldHeight = newHeight;

			// Enable pluggins
			focusedElement.dragPlugin.enableDragging();
			focusedElement.selectPlugin.enableSelect();
			vp.plugins.get('drag').resume();
			vp.plugins.get('wheel').resume();
			vp.plugins.get('pinch').resume();

			// Reset the viewport position
			vp.position.set(0, 0);

			// Reset the viewport bounds before the focus mode
			const vpBounds = toRaw(this.viewportBounds);
			vp.scale.x = vpBounds.scaleX;
			vp.scale.y = vpBounds.scaleY;
			vp.x = vpBounds.posX;
			vp.y = vpBounds.posY;

			// Reset the stored viewport bounds
			this.viewportBounds.scaleX = undefined;
			this.viewportBounds.scaleY = undefined;
			this.viewportBounds.posX = undefined;
			this.viewportBounds.posY = undefined;

			// Show all other elements
			for (const child of vp.children) {
				child.visible = true;
			}

			// dirty
			vp.plugins.reset();
			vp.dirty = true;
		},
		_createCanvasElement(this: ProjectStore, event: PointerEvent) {
			const { clientX, clientY } = event;
			const scene = toRaw(this.scene);

			const originWidth = 200;
			const originHeigh = 200;
			const scale = scene.viewport.scale.x;
			const canvasX = (clientX - scene.viewport.x) / scale / 2;
			const canvasY = (clientY - scene.viewport.y) / scale / 2;
			const centerX = canvasX - originWidth / 4;
			const centerY = canvasY - originHeigh / 4;

			if (this.action.target === Target.POSTIT) {
				const sticky = new StickyNote(scene.stage, scene.viewport, {
					width: originWidth,
					height: originHeigh,
					positionX: centerX,
					positionY: centerY,
					color: 0xffffffff,
				});

				scene.viewport.addChild(sticky);
				this.scene = scene;
			}

			if (this.action.target === Target.TEXT) {
				const textbox = new TextBox(scene.stage, scene.viewport, {
					width: originWidth,
					height: originHeigh,
					positionX: centerX,
					positionY: centerY,
					color: 0x00000000,
				});

				scene.viewport.addChild(textbox);
				this.scene = scene;
			}

			this.updateCursor(DEFAULT_ACTION.cursor);
			this.action = DEFAULT_ACTION;
			this.canvas.removeEventListener('pointerup', this._createCanvasElement);
		},
	},
});
