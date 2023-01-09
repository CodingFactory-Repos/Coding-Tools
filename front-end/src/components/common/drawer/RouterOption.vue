<template>
	<RouterLink :to="to" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700 min-w-max">
		<SVGLoader v-bind="logo"/>
		<span class="ml-3 dark:text-gray-400" :class="{ 'lg:hidden': fold }" sidebar-toggle-item="">{{ name }}</span>
	</RouterLink>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { SvgOptions } from '@/interfaces/svg';
import SVGLoader from "@/components/common/SVGLoader";

defineProps({
	to: { type: String, required: true },
	name: { type: String, required: true },
	fold: { type: Boolean, required: true },
	logo: {
		type: Object as PropType<SvgOptions>,
		required: false,
		default: {
			name: 'default',
			size: '24px',
		} as SvgOptions,
	},
});
</script>
