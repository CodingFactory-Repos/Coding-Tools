<template>
	<main class="custom-background">
		<AskCredentials />
	</main>
</template>

<script lang="ts" setup>
import AskCredentials from '@/components/auth/signin/AskCredentials.vue';
</script>

<style scoped>
main {
	width: 100%;
	display: flex;
}
</style>