<template>
	<div class="flex flex-col gap-24 w-full h-full justify-center items-center custom-background">
		<Svg404/>
		<DefaultButton
			text="Go back home"
			to="/"
			text-style="text-gray-600"
			background="bg-light-primary"
		/>
	</div>
</template>


<script setup lang="ts">
import DefaultButton from '@/components/common/buttons/Default.vue';
import Svg404 from '@/components/common/svg/404.vue';
</script>