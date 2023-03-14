<template>
	<div class="view">
		<HeaderLayout></HeaderLayout>

		<div class="content bg-white mt-16 dark:bg-gray-800">
			<router-view></router-view>
		</div>

		<FooterLayout v-if="isHero"></FooterLayout>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import HeaderLayout from './HeaderLayout.vue';
import FooterLayout from './FooterLayout.vue';

const route = useRoute();
const isHero = computed(() => route.path === "/");
</script>
