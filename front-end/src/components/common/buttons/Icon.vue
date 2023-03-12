<template>
	<component :is="to ? RouterLink : 'button'" :to="to" class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
		<SVGLoader v-bind="logo"></SVGLoader>
	</component>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { RouterLink } from "vue-router";
import { SvgOptions } from "@/interfaces/svg";
import SVGLoader from "@/components/common/SVGLoader";

defineProps({
	to: { type: String, required: false },
	type: { type: String, required: false },
	logo: {
		type: Object as PropType<SvgOptions>,
		required: false,
		default: {
			name: 'default',
			size: '24px',
		} as SvgOptions,
	},
})
</script>