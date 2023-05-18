<template>
	<div class="w-full flex flex-col gap-4 h-full justify-start items-start mx-5 mt-16">
		<h1 class="text-2xl font-bold text-[#5c5f73] dark:text-dark-font">All retrospectives</h1>
		<div class="w-full flex grow relative items-center justify-center">
			<div
				class="flex flex-col items-center justify-center gap-5 p-4 z-10 bg-light-primary dark:bg-dark-tertiary rounded-lg"
			>
				<h3 class="text-lg font-bold text-[#5c5f73] dark:text-dark-font text-center">Your saved retros will be shown here in the future.</h3>
				<DefaultButton
					type="button"
					text="Start your first retro here !"
					background="bg-pink-600"
					text-style="text-white"
					@click="chooseTemplate"
				/>
			</div>
		</div>
		<div class="w-full flex grow gap-3 flex-wrap">
			<Overlay v-model:active="active" :fullSize="false">
				<ChooseTemplate />
			</Overlay>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Overlay from '@/components/retrospectiveComponents/utils/Overlay.vue';
import ChooseTemplate from './ChooseTemplate.vue';
import DefaultButton from "@/components/common/buttons/Default.vue";

export default defineComponent({
	components: {
		DefaultButton,
		Overlay,
		ChooseTemplate,
	},
	setup() {
		const active = ref(false);
		const displayTemplate = ref(false);

		const chooseTemplate = () => {
			active.value = true;
			if (displayTemplate.value === false) {
				displayTemplate.value = true;
			} else {
				displayTemplate.value = false;
			}
		};

		return {
			chooseTemplate,
			displayTemplate,
			active,
		};
	},
});
</script>
