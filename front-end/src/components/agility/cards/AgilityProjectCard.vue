<template>
	<div class="w-52 h-fit flex flex-col justify-between bg-light-primary dark:bg-dark-tertiary p-3 rounded-lg gap-2 cursor-pointer select">
		<img v-if="url" class="w-full h-48 rounded" :src="url" :alt="`project_${title}_snapshot`"/>
		<span class="dark:text-dark-font text-sm font-bold">{{ title }}</span>
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