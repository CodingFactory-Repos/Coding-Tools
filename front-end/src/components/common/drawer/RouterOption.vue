<template>
	<li class="relative">
		<div v-if="alert" class="absolute pointer-events-none text-white top-[-2.5px] left-[-2.5px] w-5 h-5 flex justify-center items-center rounded text-sm font-bold bg-rose-700">
			!
		</div>
		<RouterLink :to="to" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg group dark:text-gray-200 hover:bg-light-secondary dark:hover:bg-dark-tertiary min-w-max">
			<slot></slot>
			<span class="ml-3 font-bold text-sm mt-1" :class="{ 'hidden': fold }" sidebar-toggle-item="">{{ name }}</span>
		</RouterLink>
	</li>
</template>

<script lang="ts" setup>
defineProps({
	to: { type: String, required: true },
	name: { type: String, required: true },
	fold: { type: Boolean, required: true },
	alert: { type: Boolean, required: false },
});
</script>
