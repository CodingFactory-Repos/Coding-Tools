<template>
	<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>Name</label
	>
	<input
		type="text"
		id="name"
		v-model="name"
		name="name"
		class="form-control block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none"
		placeholder="Enter name"
	/>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const name = ref('');
</script>

<style scoped></style>
