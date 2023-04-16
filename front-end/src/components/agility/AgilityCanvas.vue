<template>
	<AgilityCanvasUI :room-id="roomId">
		<canvas ref="canvas"></canvas>
	</AgilityCanvasUI>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

import { Scene } from '@/lib/pixi-tools-v2/scene';
import { useProjectStore } from '@/store/modules/project.store';
import { CanvasSocketOptions } from '@/lib/pixi-tools-v2/plugins/viewportSocketPlugin';
import AgilityCanvasUI from './AgilityCanvasUI.vue';

const route = useRoute();
const projectStore = useProjectStore();
const canvas = ref<HTMLCanvasElement>();
const roomId = ref(route.path.match(/[^/]+$/)[0]);

onMounted(() => {
	document.addEventListener('fullscreenchange', onFullscreenChange);

	const socketOptions: CanvasSocketOptions = {
		uri: "ws://localhost:8010",
		roomId: roomId.value,
		options: {
			transports: ["websocket"],
			withCredentials: true,
			path: '/socket.io'
		}
	}

	// 84 represent the offset height due to tabs
	const scene = new Scene(canvas.value as HTMLCanvasElement, 84, socketOptions);
	projectStore.scene = scene;
	projectStore.canvas = canvas.value;
	projectStore.enableSelectionBox();
})

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