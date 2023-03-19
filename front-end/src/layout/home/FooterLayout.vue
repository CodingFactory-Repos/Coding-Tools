<template>
	<footer class="p-4 shadow md:px-6 md:py-6 bg-light-primary dark:bg-dark-primary">
		<div class="flex items-center justify-between">
			<RouterLink to="/" class="flex items-center">
				<SvgLogo class="flex"/>
			</RouterLink>
		</div>
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
			© 2023 Coding Tools™. All Rights Reserved.
		</span>
	</footer>
</template>

<script setup lang="ts">
import SvgLogo from '@/components/common/svg/Logo.vue';
</script>
