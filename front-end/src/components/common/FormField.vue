<template>
	<div class="flex flex-col gap-1 justify-start items-start w-full">
		<span v-if="label" class="text-black dark:text-dark-font pb-2 text-sm font-bold">{{ label }}</span>
		<slot/>
		<span v-if="limit" class="text-[#b54593] dark:text-dark-font text-xs">
			{{ charNumber }}/{{ charLimit }}
		</span>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	label?: string,
	limit: boolean,
	charLimit?: string | number,
	charNumber?: string | number,
}>();
</script>