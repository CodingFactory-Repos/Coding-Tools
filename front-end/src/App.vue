<template>
	<Navbar />

	<div class="top-0 right-0 w-auto h-screen text-center ml-[40px]">
		<router-view />
	</div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue';
</script>
