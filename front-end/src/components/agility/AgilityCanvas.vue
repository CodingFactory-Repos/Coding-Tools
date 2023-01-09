<template>
	<AgilityCanvasUI>
		<canvas ref="canvas"></canvas>
	</AgilityCanvasUI>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Scene } from '@/lib/pixi-tools/scene';
import AgilityCanvasUI from './AgilityCanvasUI.vue';
import { useProjectStore } from '@/store/modules/project.store';
import { PixiObject } from '@/lib/pixi-tools/types';

const projectStore = useProjectStore();
const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
	const darkMode = true;
	const scene = new Scene(canvas.value as HTMLCanvasElement, darkMode);
	projectStore.setScene(scene);
	projectStore.setCanvas(canvas.value);
	canvas.value.classList.toggle(projectStore.action.cursor);


	document.addEventListener("keydown", (event: KeyboardEvent) => {
		const key = event.key;

		if (key === "Backspace") {
			scene.viewport.children.forEach((container: PixiObject) => {
				if (container.isSelected) {
					container.destroyObject();
				}
			})
		}
	})
})
</script>

<style>
.default {
	cursor: inherit !important;
}

.text {
	cursor: text !important;
}

.postit {
	cursor: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij4KPHBhdGggZD0iTTQuOCA0LjhWMTkuMkgxMi45VjE0LjdDMTIuOSAxNC4yMjI2IDEzLjA4OTYgMTMuNzY0OCAxMy40MjcyIDEzLjQyNzJDMTMuNzY0OCAxMy4wODk2IDE0LjIyMjYgMTIuOSAxNC43IDEyLjlIMTkuMlY0LjhINC44Wk00LjggM0gxOS4yQzE5LjY3NzQgMyAyMC4xMzUyIDMuMTg5NjQgMjAuNDcyOCAzLjUyNzIxQzIwLjgxMDQgMy44NjQ3NyAyMSA0LjMyMjYxIDIxIDQuOFYxMy45NTQ4QzIwLjk5OTkgMTQuNDMyMSAyMC44MTAyIDE0Ljg4OTkgMjAuNDcyNiAxNS4yMjc0TDE1LjIyNzQgMjAuNDcyNkMxNC44ODk5IDIwLjgxMDIgMTQuNDMyMSAyMC45OTk5IDEzLjk1NDggMjFINC44QzQuMzIyNjEgMjEgMy44NjQ3NyAyMC44MTA0IDMuNTI3MjEgMjAuNDcyOEMzLjE4OTY0IDIwLjEzNTIgMyAxOS42Nzc0IDMgMTkuMlY0LjhDMyA0LjMyMjYxIDMuMTg5NjQgMy44NjQ3NyAzLjUyNzIxIDMuNTI3MjFDMy44NjQ3NyAzLjE4OTY0IDQuMzIyNjEgMyA0LjggM1oiIGZpbGw9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuNyIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L3N2Zz4=") 16 16, pointer !important;
}
</style>