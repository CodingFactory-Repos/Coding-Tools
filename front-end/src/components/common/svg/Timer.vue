<template>
	<svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<g class="base-timer__circle">
			<circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
			<path
				:stroke-dasharray="circleDasharray"
				stroke="purple"
				:class="remainingPathColor"

				d=" M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0 "
			></path>
		</g>
	</svg>
</template>

<script lang="ts" setup>
defineProps({
	circleDasharray: { type: String, required: false },
	remainingPathColor: { type: String, required: false },
});
</script>


