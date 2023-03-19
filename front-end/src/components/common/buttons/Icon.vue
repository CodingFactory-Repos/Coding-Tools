<template>
	<component 
		:is="to ? RouterLink : foreignLink ? 'a' : 'button'"
		:to="to"
		class="p-2 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-tertiary"
	>
		<slot></slot>
	</component>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';

defineProps({
	to: { type: String, required: false },
	type: { type: String, required: false },
	foreignLink: { type: Boolean, required: false }
})
</script>