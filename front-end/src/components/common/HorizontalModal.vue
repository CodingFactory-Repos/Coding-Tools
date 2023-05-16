<template>
	<div class="flex flex-wrap">
		<div class="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 mb-4 bg-gray-500"></div>
		<div class="w-full sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-2/3 mb-4 bg-gray-500"></div>
	</div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({
	position: {
		type: String as PropType<
			| 'bottom-left'
			| 'bottom-right'
			| 'bottom-center'
			| 'top-left'
			| 'top-center'
			| 'top-right'
			| 'center-left'
			| 'center'
			| 'center-right'
		>,
		default: 'center',
	},
	size: {
		type: String as PropType<
			'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
		>,
		default: '2xl',
	},
});

const emit = defineEmits(['close']);
const modalSizeClasses = {
	xs: 'max-w-xs',
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
	'5xl': 'max-w-5xl',
	'6xl': 'max-w-6xl',
	'7xl': 'max-w-7xl',
};

function closeModal() {
	emit('close');
}
</script>
