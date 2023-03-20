<template>
	<component
		:is="to ? RouterLink : 'button'"
		:to="to"
		:type="type"
		class="font-bold rounded-lg text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2"
		:class="background"
	>
		<slot/>
		<span :class="textStyle">{{ text }}</span>
	</component>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';

defineProps({
	to: { type: String, required: false },
	text: { type: String, required: true },
	type: { type: String, required: false },
	textStyle: { type: String,required: false, default: () => "text-black dark:text-white" },
	background: { type: String, required: false },
})
</script>