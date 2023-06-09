<template>
	<div
		class="w-11 bg-slate-700 h-48 w-48"
		:draggable="true"
		@dragstart="dragStart()"
		@dragend="dragEnd"
	>
		<div
			v-if="!updatePostit"
			class="w-full h-full flex justify-center items-center bg-gray-50 relative postit:buttons-visible cursor-grab"
		>
			<button
				@click="removePostit()"
				class="text-black flex justify-center items-center absolute w-10 h-10 -right-5 -top-5 z-100 bg-[#e85454] rounded-full hidden"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path
						fill="#FFFF"
						d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7Zm2-4h2V8H9v9Zm4 0h2V8h-2v9Z"
					/>
				</svg>
			</button>
			<button
				@click="tryUpdatePostit()"
				class="text-black flex justify-center items-center absolute w-10 h-10 -right-5 top-7 z-100 bg-[#e7e7e2] rounded-full hidden"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path
						fill="#000"
						d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"
					/>
				</svg>
			</button>
			<div class="text-black break-all">
				{{ privatePostit.value }}
			</div>
		</div>
		<div
			v-else
			class="w-full h-full flex justify-center items-center bg-gray-50 relative postit:buttons-visible cursor-grab"
		>
			<textarea
				v-model="privatePostit.value"
				id="message"
				rows="4"
				class="block p-2.5 h-full w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
				placeholder="Update"
				@blur="focusOut"
				ref="updatePostitArea"
			>
			</textarea>
			<button
				@click="writeUpdatePostit"
				class="text-black text-black flex justify-center items-center absolute w-10 h-10 -bottom-5 -left-5 z-100 bg-[#13ab80] rounded-full"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
					<path
						fill="none"
						stroke="#f7f6f1"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="m2.75 8.75l3.5 3.5l7-7.5"
					/>
				</svg>
			</button>
			<button
				@click="undoModification"
				class="text-black text-black flex justify-center items-center absolute w-10 h-10 -bottom-5 left-7 z-100 bg-[#e85454] rounded-full"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 11 11">
					<path
						d="M2.2 1.19l3.3 3.3L8.8 1.2a.67.67 0 0 1 .5-.2a.75.75 0 0 1 .7.7a.66.66 0 0 1-.2.48L6.49 5.5L9.8 8.82c.13.126.202.3.2.48a.75.75 0 0 1-.7.7a.67.67 0 0 1-.5-.2L5.5 6.51L2.21 9.8a.67.67 0 0 1-.5.2a.75.75 0 0 1-.71-.71a.66.66 0 0 1 .2-.48L4.51 5.5L1.19 2.18A.66.66 0 0 1 1 1.7a.75.75 0 0 1 .7-.7a.67.67 0 0 1 .5.19z"
						fill="#f7f6f1"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { nextTick, ref } from 'vue';

const props = defineProps({
	privatePostit: { type: Object, required: true },
});
const retroStore = useRetrospectiveStore();
const updatePostit = ref(false);
const updatePostitArea = ref();
const previousValue = ref('');

const dragStart = () => {
	retroStore.tempMovingPostit = props.privatePostit;
};

const dragEnd = () => {
	console.log('helloEND');
};

const removePostit = () => {
	retroStore.removePrivatePostit(props.privatePostit);
};

const tryUpdatePostit = () => {
	updatePostit.value = true;
	nextTick(() => {
		previousValue.value = props.privatePostit.value;
		updatePostitArea.value.focus();
	});
};

const focusOut = () => {
	if (previousValue.value === '') {
		updatePostit.value = false;
	}
	if (previousValue.value === props.privatePostit.value) {
		updatePostit.value = false;
	}
};

const writeUpdatePostit = () => {
	retroStore.updatePrivatePostit(props.privatePostit);
	previousValue.value = '';
	updatePostit.value = false;
};

const undoModification = () => {
	props.privatePostit.value = previousValue.value;
	previousValue.value = '';
	updatePostit.value = false;
};
</script>

<style lang="scss" scoped>
.postit\:buttons-visible:hover > .hidden {
	display: flex;
}
</style>
