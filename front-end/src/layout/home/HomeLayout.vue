<template>
	<div class="view">
		<HeaderLayout></HeaderLayout>

		<div class="content pt-12 pb-12">
			<router-view></router-view>
		</div>

		<FooterLayout></FooterLayout>
	</div>
</template>

<script setup lang="ts">
import HeaderLayout from './HeaderLayout.vue';
import FooterLayout from './FooterLayout.vue';
</script>
