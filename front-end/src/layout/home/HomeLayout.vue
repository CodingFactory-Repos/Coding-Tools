<template>
	<div class="view">
		<HeaderLayout></HeaderLayout>

		<div class="content mt-16 py-12 px-8 bg-white dark:bg-gray-800">
			<router-view></router-view>
		</div>

		<FooterLayout></FooterLayout>
	</div>
</template>

<script setup lang="ts">
import HeaderLayout from './HeaderLayout.vue';
import FooterLayout from './FooterLayout.vue';
</script>
