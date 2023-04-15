<template>
	<AgilityCanvasUI>
		<canvas ref="canvas"></canvas>
	</AgilityCanvasUI>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Scene } from '@/lib/pixi-tools-v2/scene';
import AgilityCanvasUI from './AgilityCanvasUI.vue';
import { useProjectStorev2 } from '@/store/modules/project2.store';
import { onBeforeRouteLeave } from 'vue-router';
import { CanvasSocketOptions } from '@/lib/pixi-tools-v2/plugins/viewportSocketPlugin';

const projectStore = useProjectStorev2();
const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
	const socketOptions: CanvasSocketOptions = {
		uri: "ws://localhost:8010",
		roomId: "fiuofpaiefzufb",
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

onMounted(() => {
	document.addEventListener('fullscreenchange', onFullscreenChange);
})

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