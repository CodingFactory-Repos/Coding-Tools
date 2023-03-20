<template>
	<div>
		<div class="bg-dark-primary bg-opacity-50 dark:bg-opacity-60 fixed inset-0 z-40" @click="closeModal"/>
		<div
			tabindex="-1"
			class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full inset-0 h-full justify-center items-center flex"
		>
			<div class="relative p-4 w-full h-auto" :class="`${modalSizeClasses[size]}`">
				<!-- Modal content -->
				<div class="relative rounded-lg shadow bg-light-primary dark:bg-dark-tertiary p-4">

					<button @click="closeModal" type="button" class="absolute right-2 top-2 bg-transparent hover:bg-light-secondary dark:hover:bg-dark-tertiary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
						<slot name="close-icon">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
						</slot>
					</button>

					<!-- Modal header -->
					<div class="rounded-t flex justify-between items-center" :class="$slots.header ? 'border-b border-light-secondary dark:border-dark-highlight' : ''">
						<slot name="header" />
					</div>

					<!-- Modal body -->
					<div :class="$slots.footer ? '!py-6' : ''">
						<slot name="body" />
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