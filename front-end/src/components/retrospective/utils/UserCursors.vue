<template>
		<div v-for="userCursor in userCursors" :key="userCursor.clientId" :style="{ left: userCursor.position.x + 'px', top: userCursor.position.y + 'px' }"  class="cursor" id="cursor">
</div>

</template>

<script lang="ts" setup>
import { socketRetro } from '@/composables/useSocketRetro';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { onMounted,  onBeforeUnmount, computed } from 'vue';


const retroStore = useRetrospectiveStore();
const userCursors = computed(() => retroStore.userCursors)


onMounted(() => {
	window.addEventListener("mousemove", handleMouseMove);
})
onBeforeUnmount(() => {
	window.removeEventListener("mousemove", handleMouseMove);
})

const handleMouseMove = (event: MouseEvent) => {
	const mouseX = event.clientX;
	const mouseY = event.clientY;

	socketRetro.socket.emit("update-mouse-moved", { x: mouseX, y: mouseY });
}


</script>
<style lang="scss" scoped>
#cursor {
	position: absolute;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	z-index: 10;
	transform: translate(-250%, 100%);
	background: #D61F69;
	margin-left: -25px;
	margin-top: -25px;
}
</style>