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

const projectStore = useProjectStorev2();
const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
	const scene = new Scene(canvas.value as HTMLCanvasElement);
	projectStore.scene = scene;
	projectStore.canvas = canvas.value;
})
</script>