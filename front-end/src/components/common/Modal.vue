<template>
	<div>
		<div class="bg-dark-primary bg-opacity-50 dark:bg-opacity-60 fixed inset-0 z-[60]" @click="closeModal"/>
		<div
			tabindex="-1"
			class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[70] w-full inset-0 h-full justify-center items-center flex"
		>
			<div class="relative p-4 w-full h-auto" :class="`${modalSizeClasses[size]}`">
				<!-- Modal content -->
				<div class="relative rounded-lg shadow bg-light-primary dark:bg-dark-tertiary p-4">

					<button @click="closeModal" type="button" class="absolute right-2 top-2 bg-transparent hover:bg-light-secondary dark:hover:bg-dark-secondary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
						<SvgCross class="!fill-red-500"/>
					</button>

					<!-- Modal header -->
					<div class="rounded-t flex justify-between items-center" :class="$slots.header ? 'border-b border-light-secondary dark:border-dark-highlight' : ''">
						<slot name="header" />
					</div>

					<!-- Modal body -->
					<div :class="$slots.footer ? '!py-6' : ''">
						<slot name="body" id="body" />
					</div>

					<!-- Modal footer -->
					<div v-if="$slots.footer" class="pt-6 rounded-b border-t border-light-secondary dark:border-dark-highlight">
						<slot name="footer" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import SvgCross from '@/components/common/svg/Cross.vue';

defineProps({
	position: {
		type: String as PropType<'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right'>,
		default: 'center',
	},
	size: {
		type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'>,
		default: '2xl',
	},
})

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
}

function closeModal() {
	emit('close')
}
</script>