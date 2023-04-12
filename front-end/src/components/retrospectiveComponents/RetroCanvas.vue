<template>
	<RetroCanvasUI>
		<UserCursor :sceneId="sceneId" :scene="scene"></UserCursor>
		<!-- <div id="cursor" ref="cursors" :style="cursorStyle"></div> -->
		<!-- <div v-for="(user, index) in users" :key="user[id]" :style="{ top: user.y + 'px', left: user.x + 'px' }" class="cursor" id="cursor"></div> -->
		<!-- <div v-for="user in users" :key="user.id" :style="`position:absolute; top:${user.y}px; left:${user.x}px;`" class="user-cursor" /> -->
		<canvas ref="canvas" id="canvas"></canvas>
	</RetroCanvasUI>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onBeforeMount, watch, reactive, onUnmounted } from 'vue';
import { Scene } from '@/lib/pixi-tools/scene';
import RetroCanvasUI from './UI/RetroCanvasUI.vue';
import { useProjectStore } from '@/store/modules/project.store';
import { PixiObject } from '@/lib/pixi-tools/types';
import createRetroTemplate from '@/composables/createRetroTemplate';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { useRoute } from 'vue-router';
import { Socket } from 'engine.io-client';
import { state } from '@/composables/socketRetro';
import UserCursor from './utils/UserCursor.vue';

const projectStore = useProjectStore();
const retroStore = useRetrospectiveStore();
const canvas = ref<HTMLCanvasElement>();
const templateOptions = computed(() => retroStore.retro.optionTemplate);
const route = useRoute();
const isFromSlug = ref(false);
const mouseY = ref(0);
const mouseX = ref(0);
const sceneId = computed(() => route.params.slug as string);
const cursor = reactive({
	x: 0,
	y: 0
})
const users = reactive({});
// const users = reactive([]);
const cursors =  ref({})
const cursorStyle = computed(() => {
	return {
		left: `${mouseX.value}px`,
		top: `${mouseY.value}px`
	}
})
const scene = ref(null);

onBeforeMount(() => {
	console.log("templateOptions", templateOptions.value);
	if (templateOptions.value === 0) {
		isFromSlug.value = true;
	} else {
		isFromSlug.value = false;
	}
	retroStore.getCurrentRetro(route.params.slug as string);
});

watch(templateOptions, value => {
	if (value !== 0) {
		const darkMode = true;
		scene.value = new Scene(canvas.value as HTMLCanvasElement, darkMode);
		createRetroTemplate(scene, templateOptions.value);

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
	}
})

// socket.on('mousemove', ({ id, x, y }) => {
//         // Mettre à jour la position de l'utilisateur correspondant
//         users[id] = { x, y };
//       });

onMounted(() => {
	// state.socket.emit('join', route.params.slug);
	// state.socket.on('mousemove', (({ id, x, y }) => {
	// 	console.log("bonjout", users);

	// 	users[id] = { x, y };
	// }))

	if (isFromSlug.value === false) {
		state.socket.emit('test')


		const darkMode = true;
		scene.value = new Scene(canvas.value as HTMLCanvasElement, darkMode);
		createRetroTemplate(scene.value, templateOptions.value);

		projectStore.setScene(scene.value);

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
	}
	// scene.value.view.addEventListener("mousemove", ((event: any) => {
	// 		mouseX.value = event.offsetX;
	// 		mouseY.value = event.offsetY;
	// 		state.socket.emit('mousemove', { x: mouseX.value, y: mouseY.value });
	// 	}))
	// 	scene.value.ticker.add(() => {
	// 		for (const user of Object.values(users)) {
	// 			let cursor = document.getElementById(user.id);
	// 			if (!cursor) {
	// 				// Si la div pour l'utilisateur n'existe pas, la créer
	// 				cursor = document.createElement('div');
	// 				cursor.id = user.id;
	// 				cursor.classList.add('cursor');
	// 				document.body.appendChild(cursor);
	// 			}
	// 			cursor.style.top = user.y + 'px';
	// 			cursor.style.left = user.x + 'px';
	// 		}
	// 	});
})

// onUnmounted(() => {
//       state.socket.emit('leave', sceneId);
//     });

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

#pointers {
	position: relative;
}

#pointers .pointer {
	position: absolute;
	width: 15px;
	height: 22px;
	background: url("https://uploads.codesandbox.io/uploads/user/88acfe5a-77fc-498c-98ee-d1b0b303f6a8/tC4n-pointer.png")
	no-repeat -4px 0;
}

#cursor {
	position: absolute;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: red;
	z-index: 10;
}
.user-cursor {
  width: 10px;
  height: 10px;
  background-color: blue;
  border-radius: 50%;
}
</style>