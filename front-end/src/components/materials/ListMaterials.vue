<template>
	<div class="w-full flex flex-col gap-4 h-full justify-start items-start">
		<h1 class="text-2xl font-bold dark:text-dark-font">List of all materials</h1>
		<MaterialCard :url="image" />
	</div>
</template>

<script>
import MaterialCard from '@/components/materials/MaterialCard.vue';

export default {
	name: 'ListMaterials',
	components: { MaterialCard },
};
</script>

<style scoped></style>
