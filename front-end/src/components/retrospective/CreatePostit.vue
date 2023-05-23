<template>
	<div class="w-11 bg-slate-700 h-48 w-48 ">
		<div class="flex flex-col h-full">
			<textarea v-model="postitValue" id="message" rows="4"
				class="block p-2.5 h-full w-full text-sm text-gray-900 bg-gray-50  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
				placeholder="Write your thoughts here..."></textarea>
			<div class="relative">
				<!-- TODO SVG FOR BUTTON -->
				<button @click="createPrivPostit" class="absolute text-black bottom-0 bg-slate-200">Create Retro</button>
			</div>
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

const createPrivPostit = async () => {
	if (postitValue.value === "")
		return;
	const privatePostit = {
		user: currentUser.value.profile.email,
		value: postitValue.value
	}
	const resp = await retroStore.createPrivatePostit(privatePostit);
	if (resp === true)
		postitValue.value = "";
}


</script>