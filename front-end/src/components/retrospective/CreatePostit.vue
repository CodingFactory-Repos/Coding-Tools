<template>
	<div class="w-11 bg-slate-700 h-48 w-48 ">
		<div class="w-full h-full flex justify-center items-center bg-gray-50 relative  cursor-grab postit:buttons-visible">
			<textarea
				v-model="postitValue"
				id="message"
				rows="4"
				class="block p-2.5 h-full w-full text-sm text-gray-900 bg-gray-50  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
				placeholder="Write your thoughts here..."
				@focus="focusTextArea"
				@blur="focusOutTextArea"
			>
			</textarea>
			<button
				@click="createPrivPostit"
				class="text-black text-black flex justify-center items-center absolute w-10 h-10 -bottom-5 -left-5 z-10 bg-[#13ab80] rounded-full"
				:class="isAreaFocused ? '' : 'hidden'"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
					<path fill="none" stroke="#f7f6f1" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
						d="m2.75 8.75l3.5 3.5l7-7.5" />
				</svg>
			</button>
			<button
				@click="undoModification"
				class="text-black text-black flex justify-center items-center absolute w-10 h-10 -bottom-5 left-7 z-10 bg-[#e85454] rounded-full"
				:class="isAreaFocused ? '' : 'hidden'"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 11 11">
					<path
						d="M2.2 1.19l3.3 3.3L8.8 1.2a.67.67 0 0 1 .5-.2a.75.75 0 0 1 .7.7a.66.66 0 0 1-.2.48L6.49 5.5L9.8 8.82c.13.126.202.3.2.48a.75.75 0 0 1-.7.7a.67.67 0 0 1-.5-.2L5.5 6.51L2.21 9.8a.67.67 0 0 1-.5.2a.75.75 0 0 1-.71-.71a.66.66 0 0 1 .2-.48L4.51 5.5L1.19 2.18A.66.66 0 0 1 1 1.7a.75.75 0 0 1 .7-.7a.67.67 0 0 1 .5.19z"
						fill="#f7f6f1" />
				</svg>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/modules/auth.store';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { computed, ref } from 'vue';


const postitValue = ref("");
const authStore = useAuthStore();
const retroStore = useRetrospectiveStore();
const currentUser = computed(() => authStore.user)
const isAreaFocused = ref(false)

const createPrivPostit = async () => {
	if (postitValue.value === "")
		return;
	const privatePostit = {
		user: currentUser.value.profile.email,
		value: postitValue.value,
		visible: false,
	}
	const resp = await retroStore.createPrivatePostit(privatePostit);
	if (resp === true)
		postitValue.value = "";
		isAreaFocused.value = false
}

const undoModification =  () => {
	postitValue.value = "";
}

const focusTextArea = () => {
	isAreaFocused.value = true
}

const focusOutTextArea = async (event) => {
	if (postitValue.value === "") {
		isAreaFocused.value = false
		return;
	} else {
		isAreaFocused.value = false
	}
}



</script>

<style lang="scss" scoped>

.postit\:buttons-visible:hover > .hidden {
	display: flex;
}
</style>