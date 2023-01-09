<template>
	<div>
		<canvas ref="canvas"></canvas>
	</div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import { StickyNote } from '@/lib/pixi-tools/models/stickyNote';
import { Scene } from '@/lib/pixi-tools/scene';

export default defineComponent({
	setup() {
		const canvas = ref<HTMLCanvasElement>();

		onMounted(() => {
			const scene = new Scene(canvas.value as HTMLCanvasElement);
			const sticky = new StickyNote(scene.stage, scene.viewport, {
				width: 200,
				height: 200,
			})

			scene.containers.push(sticky);
			scene.viewport.addChild(sticky);
		});

		return { canvas };
	},
});
</script>