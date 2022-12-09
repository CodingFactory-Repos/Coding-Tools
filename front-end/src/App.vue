<template>
	<Navbar />

	<div class="top-0 right-0 w-auto h-screen text-center ml-[80px]">
		<router-view></router-view>
	</div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue';
</script>
