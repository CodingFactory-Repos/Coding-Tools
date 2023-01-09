<template>
	<div class="w-52 h-fit flex flex-col justify-between dark:bg-gray-800 bg-white p-3 rounded-lg gap-2 cursor-pointer select">
		<img v-if="url" class="w-full h-48 bg-gray-400 rounded" :src="url"/>
		<span class="dark:text-gray-400 text-sm font-bold">{{ title }}</span>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	title: { type: String, required: true },
	isNew: { type: Boolean, required: false },
	url: { type: String, required: false },
})
</script>

<style>
.select:hover {
	box-shadow: 0 0 0 1px #3b82f6;
}
</style>