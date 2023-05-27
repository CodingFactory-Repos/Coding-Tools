<template>
	<div
		class="h-48 w-48 flex justify-center items-center bg-gray-50 "
		:draggable="true"
        @dragstart="dragStart()"
        @dragend="dragEnd"
	>
		<div class="text-black">
			{{ postit.value }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';

const props = defineProps({
	postit: { type: Object, required: true}
})
const retroStore = useRetrospectiveStore();

const dragStart = () => {
	// console.log("bonjour");
	// console.log("props", props.postit);
	retroStore.tempMovingPostit = props.postit;

}

const dragEnd = () => {
	console.log("goodbye");

}
</script>