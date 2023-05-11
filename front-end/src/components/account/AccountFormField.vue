<template>
	<div class="flex flex-col gap-1 justify-start items-start w-full">
		<span class="text-ligh-font dark:text-dark-font pb-2 text-sm font-bold">{{ label }}</span>
		<slot/>
		<span v-if="limit" class="text-ligh-font dark:text-dark-font text-xs">
			{{ charNumber }}/{{ charLimit }}
		</span>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	label: string,
	limit: boolean,
	charLimit?: string | number,
	charNumber?: string | number,
}>();
</script>