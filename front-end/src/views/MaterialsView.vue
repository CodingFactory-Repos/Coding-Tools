<template>
	<div class="container mx-5">
		<div class="ButtonsContainer">
			<ButtonsMaterials />
		</div>
		<h2 class="text-2xl font-bold dark:text-dark-font">List of all materials</h2>
		<div class="cards mt-5">
			<ListMaterials />
		</div>
	</div>
</template>

<script lang="ts">
import ListMaterials from '@/components/materials/ListMaterials.vue';
import ButtonsMaterials from '@/components/materials/ButtonsMaterials.vue';

export default {
	components: { ListMaterials, ButtonsMaterials },
};
</script>

<style scoped>
.ButtonsContainer {
	width: 100%;
	text-align: center;
	margin-top: 55px;
}
.cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: left;
}
</style>
