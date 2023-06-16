<template>
	<CanvasLoader :loading="loading">
		<AgilityCanvasUI :room-id="roomId">
			<canvas ref="canvas"></canvas>
			<canvas ref="cursorCanvas" class="absolute pointer-events-none"></canvas>
		</AgilityCanvasUI>
	</CanvasLoader>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

import { CanvasSocketOptions } from '@/lib/pixi-tools-v2/plugins/viewportSocketPlugin';
import { Normalizer } from '@/lib/pixi-tools-v2/class/normalyzer';
import { Scene } from '@/lib/pixi-tools-v2/scene';

import { useProjectStore } from '@/store/modules/project.store';
import { useAgilityStore } from '@/store/modules/agility.store';
import AgilityCanvasUI from '@/components/agility/AgilityCanvasUI.vue';
import CanvasLoader from '@/components/agility/UI/CanvasLoader.vue';
import { LineContainer } from '@/lib/pixi-tools-v2/class/lineContainer';
import { CanvasContainer } from '@/lib/pixi-tools-v2/types/pixi-aliases';
import { useThemeStore } from '@/store/modules/theme.store';
import { config } from '@/config/config';
import { CursorScene } from '@/lib/pixi-tools-v2/cursorScene';
import { useAuthStore } from '../../store/modules/auth.store';

const route = useRoute();
const projectStore = useProjectStore();
const agilityStore = useAgilityStore();
const themeStore = useThemeStore();

const isDark = computed(() => themeStore.theme);
const scene = computed(() => projectStore.scene);
const projectLoading = computed(() => agilityStore.projectLoading);
const viewportBounds = computed(() => projectStore.getViewportBounds);
const project = computed(() => agilityStore.currentProject);

const canvas = ref<HTMLCanvasElement>();
const cursorCanvas = ref<HTMLCanvasElement>();

const roomId = ref(route.path.match(/[^/]+(?=\?)|[^/]+$/)[0]);
const loading = computed(() => projectLoading.value || projectStore.internalLoading);
let timeout: NodeJS.Timeout = null;
let rawScene: Scene = null;
let rawCursorScene: CursorScene = null; 

watch(isDark, val => {
	if(scene.value) {
		scene.value.changeTheme(val);
	}
});

watch(viewportBounds, val => {
	rawCursorScene.viewport.x = val.x;
	rawCursorScene.viewport.y = val.y;

	if(val.scaleX !== undefined && val.scaleY !== undefined) {
		rawCursorScene.viewport.scale.set(val.scaleX, val.scaleY);
	}

	if(val.mouseX !== undefined && val.mouseY !== undefined) {
		rawCursorScene.viewport.updateMousePosition({ x: val.mouseX, y: val.mouseY });
	}
}, { deep: true });

onMounted(() => {
	document.addEventListener('fullscreenchange', onFullscreenChange);

	const socketOptions: CanvasSocketOptions = {
		uri: config.socket.url,
		roomId: roomId.value,
		options: {
			transports: ['websocket'],
			withCredentials: true,
			path: '/socket.io',
		},
	};

	const authStore = useAuthStore();
	const firstName = authStore.user?.profile?.firstName ?? 'unknown';

	// 84 represent the offset height due to tabs
	const cursorScene = new CursorScene(cursorCanvas.value as HTMLCanvasElement, 84, firstName, socketOptions);
	const scene = new Scene(canvas.value as HTMLCanvasElement, 84, isDark.value, socketOptions);
	projectStore.scene = scene;
	projectStore.canvas = canvas.value;
	projectStore.enableSelectionBox();
	rawScene = scene;
	rawCursorScene = cursorScene;
})

const autoFillProject = async () => {
	if(rawScene === null) {
		timeout = setTimeout(autoFillProject, 100);
	} else {
		clearTimeout(timeout);
		timeout = null;

		const delayMs = 100;
		const batchSize = 50;
		const viewport = rawScene.viewport;
		const numBatches = Math.ceil(project.value.length / batchSize);

		function processBatch(start: number, end: number) {
			for (let n = start; n < end; n++) {
				const container = Normalizer.container(viewport, project.value[n], true);
				viewport.addChild(container);
			}
		}

		async function processBatchesWithDelay() {
			for (let i = 0; i < numBatches; i++) {
				const batchStart = i * batchSize;
				const batchEnd = Math.min(batchStart + batchSize, project.value.length);
				processBatch(batchStart, batchEnd);
				await new Promise(resolve => setTimeout(resolve, delayMs));
			}
		}

		await processBatchesWithDelay();
		linkLines();
		projectStore.internalLoading = false;
	}
}

const linkLines = () => {
	const elements =  scene.value?.viewport?.socketPlugin?.elements;
	if(elements) {
		for(const key in elements) {
			const ctn = elements[key];
			if(ctn instanceof LineContainer) {
				if(ctn.startContainer?.containerUUID !== undefined) {
					const container = elements[ctn.startContainer.containerUUID] as CanvasContainer;
					if(!container.linkedLinesUUID.includes(ctn.uuid)) {
						container.attachLine(ctn.uuid);
					}
				}

				if(ctn.endContainer?.containerUUID !== undefined) {
					const container = elements[ctn.endContainer.containerUUID] as CanvasContainer;
					if(!container.linkedLinesUUID.includes(ctn.uuid)) {
						container.attachLine(ctn.uuid);
					}
				}
			}
		}
	}
}

watch(projectLoading, val => {
	if(!val) {
		projectStore.internalLoading = true;
		autoFillProject();
	}
}, { immediate: true })

const onFullscreenChange = () => {
	if(projectStore.onFullscreen) {
		projectStore.onFullscreen = false;
	} else {
		projectStore.onFullscreen = true;
	}
}

onBeforeRouteLeave(() => {
	const vp = projectStore.scene.viewport;
	vp.socketPlugin.disconnect();
	rawCursorScene.viewport.socketCursorManager._close();

	if (document.exitFullscreen && projectStore.onFullscreen) {
		projectStore.onFullscreen = false;
		document.exitFullscreen();
	}

	document.removeEventListener('fullscreenchange', onFullscreenChange);
	projectStore.stopRefreshing();
})
projectStore.startRefreshing();
</script>

<style lang="scss">
html > body div.textEditor {
	position: absolute;
	color: #000000;
	display: none;
	resize: none;
	margin: 0px;
	padding: 0px;
	border: none !important;
	border-width: 0px !important;
	border-color: transparent !important;
	background-color: transparent;
	line-height: 1rem;
	box-shadow: none !important;
	transform-origin: left 0px;

	&:focus-visible {
		outline: none;
	}

	&.blank::before {
		content: attr(data-placeholder);
		font-size: 14px;
		font-kerning: auto;
		overflow-wrap: break-word;
		white-space: pre-wrap;
		color: rgb(160, 160, 160);
		font-weight: normal;
	}
}
</style>
