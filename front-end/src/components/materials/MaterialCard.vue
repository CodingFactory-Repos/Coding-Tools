<template>
	<div
		class="w-100 h-100 flex flex-col gap-3 rounded-lg bg-light-primary dark:bg-dark-tertiary py-2 px-4 justify-start items-start"
	>
		<div class="w-32 h-full flex flex-col justify-between gap-2 relative" style="min-width: 8rem">
			<img
				v-if="url"
				class="w-full h-24 rounded-lg cursor-pointer select"
				:src="url"
				:alt="`template_${name}_img`"
			/>
			<img
				v-else
				class="w-full h-24 rounded-lg cursor-pointer select"
				src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg"
			/>

			<span class="dark:text-dark-font text-s font-bold">{{ name }}</span>
			<span
				class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
				>Available</span
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	name: { type: String, required: true },
	url: { type: String, required: true },
});
</script>

<style scoped>
.select:hover {
	box-shadow: 0 0 0 1px #3b82f6;
}
</style>
