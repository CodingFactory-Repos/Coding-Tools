<template>
	<div class="relative">
		<div v-if="alert" class="absolute pointer-events-none text-white top-[-2.5px] left-[-2.5px] w-5 h-5 flex justify-center items-center rounded text-sm font-bold bg-rose-700">
			!
		</div>
		<RouterLink :to="to" class="flex items-center p-2 text-base font-normal rounded-lg group hover:bg-light-secondary dark:hover:bg-dark-tertiary min-w-max">
			<slot></slot>
			<span class="ml-3 font-bold text-sm mt-1 dark:text-dark-font" :class="{ 'hidden': fold }" sidebar-toggle-item="">{{ name }}</span>
		</RouterLink>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	to: { type: String, required: true },
	name: { type: String, required: true },
	fold: { type: Boolean, required: true },
	alert: { type: Boolean, required: false },
});
</script>
