<template>
	<footer class="p-4 shadow md:px-6 md:py-6 bg-light-primary dark:bg-dark-primary">
		<div class="flex items-center justify-between">
			<RouterLink to="/" class="flex items-center">
				<SvgLogo class="flex"/>
			</RouterLink>
		</div>
		<hr class="my-6 border-light-tertiary sm:mx-auto dark:border-dark-tertiary lg:my-8" />
		<span class="block text-sm text-light-font sm:text-center dark:text-dark-font">
			© 2023 Coding Tools™. All Rights Reserved.
		</span>
	</footer>
</template>

<script setup lang="ts">
import SvgLogo from '@/components/common/svg/Logo.vue';
</script>
