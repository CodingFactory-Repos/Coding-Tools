<template>
	<div class="w-52 h-fit flex flex-col justify-between bg-light-primary dark:bg-dark-tertiary p-3 rounded-lg gap-2 cursor-pointer select">
		<img ref="imageRef" class="w-full h-48 rounded" :src="url" :alt="`${title} snapshot`"/>
		<span class="dark:text-dark-font text-sm font-bold">{{ title }}</span>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import { ref } from '@vue/reactivity';

defineProps({
	title: { type: String, required: true },
	isNew: { type: Boolean, required: false },
	url: { type: String, required: false },
})

const imageRef = ref<HTMLImageElement>();

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

<style>
.select:hover {
	box-shadow: 0 0 0 1px #3b82f6;
}
</style>