<template>
	<div class="container">
		<div class="ButtonsContainer">
			<h1>Materials</h1>
		</div>
		<div class="cards">
			<ListMaterials />
		</div>
	</div>
</template>

<script lang="ts">
import ListMaterials from '@/components/materials/ListMaterials.vue';

export default {
	components: { ListMaterials },
};
</script>

<style scoped>
.ButtonsContainer {
	width: 100%;
	text-align: center;
}
.cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: left;
}
</style>
