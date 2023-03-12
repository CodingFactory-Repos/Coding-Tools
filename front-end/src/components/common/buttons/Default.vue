<template>
	<component
		:is="to ? RouterLink : 'button'"
		:to="to"
		class="font-bold rounded-lg text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2"
		:class="background"
	>
		<slot/>
		<span class="text-black dark:text-white" :class="textStyle">{{ text }}</span>
	</component>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';

defineProps({
	to: { type: String, required: false },
	text: { type: String, required: true },
	type: { type: String, required: false },
	textStyle: { type: String,required: false },
	background: { type: String, required: false },
})
</script>