<template>
	<div>
		<MarkdownViewer :markdown="markdown" :headers="headers"></MarkdownViewer>
	</div>
</template>

<script lang="ts" setup>
import MarkdownViewer from '@/components/blog/MarkdownViewer.vue'

const props = defineProps(['markdown', 'headers'])
</script>