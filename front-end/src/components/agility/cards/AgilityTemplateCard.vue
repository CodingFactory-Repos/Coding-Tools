<template>
	<div class="w-32 h-full flex flex-col justify-between gap-2 relative" style="min-width: 8rem;">
		<span v-if="isNew" class="absolute -right-2.5 -top-2.5 px-2 bg-pink-600 rounded-lg text-white text-sm z-10">New</span>

		<img v-if="url" class="w-full h-24 rounded-lg cursor-pointer select" :src="url" :alt="`template_${name}_img`"/>
		<div v-else class="w-full h-24 gradiant hover:from-violet-800 hover:to-pink-500 rounded-lg flex items-center justify-center cursor-pointer">
			<SvgAdd class="fill-white-icon dark:fill-white-icon"/>
		</div>

		<span class="dark:text-gray-400 text-xs font-bold">{{ name }}</span>
	</div>
</template>

<script lang="ts" setup>
import SvgAdd from '@/components/common/svg/Add.vue';

defineProps({
	name: { type: String, required: true },
	isNew: { type: Boolean, required: false },
	url: { type: String, required: false },
})
</script>

<style>
.select:hover {
	box-shadow: 0 0 0 1px #3b82f6;
}
</style>