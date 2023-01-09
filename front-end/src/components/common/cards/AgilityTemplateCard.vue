<template>
	<div class="w-32 h-full flex flex-col justify-between gap-2 relative mt-2.5 mr-2.5" style="min-width: 8rem;">
		<span v-if="isNew" class="absolute -right-2.5 -top-2.5 px-2 bg-pink-600 rounded-lg text-white text-sm z-10">New</span>

		<img v-if="url" class="w-full h-24 rounded-lg cursor-pointer select" :src="url"/>
		<div v-else class="w-full h-24 bg-gradient-to-r from-violet-900 to-pink-600 hover:from-violet-800 hover:to-pink-500 rounded-lg flex items-center justify-center cursor-pointer">
			<SVGLoader v-bind="{name:'add', size:'27px', color:'dark:fill-gray-400 fill-[#ffffff]'}"/>
		</div>

		<span class="dark:text-gray-400 text-xs font-bold">{{ name }}</span>
	</div>
</template>

<script lang="ts" setup>
import SVGLoader from '@/components/common/SVGLoader';

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