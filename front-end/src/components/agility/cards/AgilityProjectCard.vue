<template>
	<div
		@click="$emit('open')"
		class="shadow-wall-card relative w-52 h-fit flex flex-col justify-between bg-light-primary dark:bg-dark-tertiary rounded-lg gap-2 cursor-pointer overflow-hidden"
		:class="{ 'd-select': isDark, 'l-select': !isDark }"
	>
		<div v-if="isOwner" class="absolute z-40 left-1 top-1 bg-white p-1 rounded shadow">
			<SvgCrown width="28" height="28"/>
		</div>
		<div class="w-full h-full flex relative">
			<div
				@click.stop="$emit('openDetail', roomId)"
				class="absolute z-40 right-1 top-1 bg-[#ffffff] p-1 rounded shadow"
			>
				<SvgThreeDot width="32" heigh="32" class="shadow-wall hidden"/>
			</div>
			<div class="shadow-wall hidden absolute w-full h-full z-20 bg-[#00000066]"></div>
			<img ref="imageRef" class="w-full h-48 rounded p-3" :src="url ?? 'https://'" :alt="`project snapshot`"/>
		</div>
		<span class="text-[#5c5f73] dark:text-dark-font text-sm font-bold px-3 pb-3">
			{{ title }}
		</span>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import { ref } from '@vue/reactivity';
import { computed } from 'vue';

import SvgCrown from '@/components/common/svg/SvgCrown.vue';
import SvgThreeDot from '@/components/common/svg/SvgThreeDot.vue';
import { useThemeStore } from '@/store/modules/theme.store';

defineProps({
	roomId: { type: String, required: true },
	isOwner: { type: Boolean, required: true },
	title: { type: String, required: true },
	isNew: { type: Boolean, required: false },
	url: { type: String, required: false },
})

const imageRef = ref<HTMLImageElement>();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme);

const replaceGenericImage = () => {
	if(imageRef.value) {
		imageRef.value.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
		imageRef.value.removeEventListener("error", replaceGenericImage);
	}
}

onMounted(() => {
	if(imageRef.value) {
		imageRef.value.addEventListener("error", replaceGenericImage);
	}
})
</script>

<style scoped lang="scss">
.d-select {
	box-shadow: 0 0 0 1px #3a4455;

	&:hover {
		box-shadow: 0 0 0 1px #737f93;
	}
}

.l-select {
	box-shadow: 0 0 0 1px #a8abb2;

	&:hover {
		box-shadow: 0 0 0 1px #3b82f6;
	}
}

:hover.shadow-wall-card .shadow-wall {
	display: flex !important;
}
</style>