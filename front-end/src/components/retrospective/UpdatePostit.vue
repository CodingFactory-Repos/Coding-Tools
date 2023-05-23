<template>
	<div
		class="w-11 bg-slate-700 h-48 w-48 "
		:draggable="true"
        @dragstart="dragStart()"
        @dragend="dragEnd"
	>
		<!-- <textarea v-model="postitValue" id="message" rows="4"
			class="block p-2.5 h-full w-full text-sm text-gray-900 bg-gray-50  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
			placeholder="Update"></textarea> -->
		<div class="w-full h-full flex justify-center items-center bg-gray-50">
			<div class="text-black">
				{{ privatePostit.value }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
const props = defineProps({
	privatePostit: { type: Object, required: true},
	index: { type: Number, required: true},
})
const retroStore = useRetrospectiveStore();

const dragStart = () => {
	props.privatePostit.index = props.index;
	retroStore.tempMovingPostit = props.privatePostit
};

const dragEnd = () => {
	console.log("helloEND");
};



</script>