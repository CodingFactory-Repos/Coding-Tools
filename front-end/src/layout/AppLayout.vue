<template>
	<div class="view">
		<!-- <He aderLayout></HeaderLayout> -->

		<div class="content !block">
			<router-view></router-view>
		</div>

		<!-- <FooterLayout></FooterLayout> -->
	</div>
</template>

<script setup lang="ts">
import HeaderLayout from './HeaderLayout.vue';
import FooterLayout from './FooterLayout.vue';
</script>
