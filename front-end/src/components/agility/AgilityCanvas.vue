<template>
	<CanvasLoader :loading="loading">
		<AgilityCanvasUI :room-id="roomId">
			<canvas ref="canvas"></canvas>
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
import { LineContainer } from '../../lib/pixi-tools-v2/class/lineContainer';
import { CanvasContainer } from '@/lib/pixi-tools-v2/types/pixi-aliases';
import { useThemeStore } from '@/store/modules/theme.store';

const route = useRoute();
const projectStore = useProjectStore();
const agilityStore = useAgilityStore();
const themeStore = useThemeStore();

const isDark = computed(() => themeStore.theme);
const scene = computed(() => projectStore.scene);
const projectLoading = computed(() => agilityStore.projectLoading);
const project = computed(() => agilityStore.currentProject);

const canvas = ref<HTMLCanvasElement>();
const roomId = ref(route.path.match(/[^/]+$/)[0]);
const loading = ref(projectLoading.value || project.value.length > 0);
let timeout: NodeJS.Timeout = null;
let rawScene: Scene = null;

watch(isDark, val => {
	if(scene.value) {
		scene.value.changeTheme(val);
	}
})

onMounted(() => {
	document.addEventListener('fullscreenchange', onFullscreenChange);

	const socketOptions: CanvasSocketOptions = {
		uri: "wss://codingtools.loule.me",
		roomId: roomId.value,
		options: {
			transports: ["websocket"],
			withCredentials: true,
			path: '/socket.io'
		},
	}

	// 84 represent the offset height due to tabs
	const scene = new Scene(canvas.value as HTMLCanvasElement, 84, isDark.value, socketOptions);
	projectStore.scene = scene;
	projectStore.canvas = canvas.value;
	projectStore.enableSelectionBox();
	rawScene = scene;
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
		loading.value = false;
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

	if (document.exitFullscreen && projectStore.onFullscreen) {
		projectStore.onFullscreen = false;
		document.exitFullscreen();
	}

	document.removeEventListener('fullscreenchange', onFullscreenChange);
})
</script>
