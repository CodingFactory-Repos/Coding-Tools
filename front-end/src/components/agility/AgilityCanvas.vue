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
import { state } from '@/composables/socketRetro';

const projectStore = useProjectStore();
const canvas = ref<HTMLCanvasElement>();
const drawing = ref(false);

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
	document.addEventListener("mousemove", (event) => {
		console.log("zneizajeiaz");
		console.log("event", event);


	})
	// scene.stage.interactive = true;

	// scene.stage.on('mousemove', () => {
	// 	console.log("bonjour");

	// })
	const context = canvas.value.getContext("2d");
	let pointerContainer = document.getElementById("pointers");

	let pointer = document.createElement("div");
	pointer.setAttribute("class", "pointer");

	let clients = {};
	let pointers = {};
	let prev: any = {};

	function drawLine(fromx, fromy, tox, toy) {
		context.moveTo(fromx, fromy);
		context.lineTo(tox, toy);
		context.stroke();
	}

	function now() {
		return new Date().getTime();
	}

	let lastEmit = now();

	canvas.value.onmouseup = canvas.value.onmousemove = canvas.value.onmousedown = function(e) {
		switch (e.type) {
			case "mouseup":
				drawing.value = false;
				console.log("mouseup");

				break;

			case "mousemove":
				state.socket.emit("mousemove", {
					x: e.pageX,
					y: e.pageY,
					drawing: drawing
				});
				console.log("bonjourazeaze");

				lastEmit = now();

				if (drawing) {
					drawLine(prev.x, prev.y, e.pageX, e.pageY);
					prev.x = e.pageX;
					prev.y = e.pageY;
				}
				break;

			case "mousedown":
				console.log("mousedown");

				drawing.value = true;
				prev.x = e.pageX;
				prev.y = e.pageY;
				break;

			default:
				break;
		}
	};

	state.socket.on("moving", function(data) {
		if (!clients.hasOwnProperty(data.id)) {
			pointers[data.id] = pointerContainer.appendChild(pointer.cloneNode());
		}

		pointers[data.id].style.left = data.x + "px";
		pointers[data.id].style.top = data.y + "px";

		if (data.drawing && clients[data.id]) {
			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
		}

		clients[data.id] = data;
		clients[data.id].updated = now();
	});

	state.socket.on("clientdisconnect", function(id) {
		delete clients[id];
		if (pointers[id]) {
			pointers[id].parentNode.removeChild(pointers[id]);
		}
	});
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