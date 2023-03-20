<!-- eslint-disable prettier/prettier -->
<template>
	<div class="container">
		<div class="tkt">
			<h1>Materials</h1>
			<ButtonsMaterials />
		</div>
		<div class="cards"> 
			<ListMaterials
			/>
		</div>
	</div>
</template>

<script>
// Post the data to the API
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ListMaterials from '@/components/materials/ListMaterials.vue';
import ButtonsMaterials from '@/components/materials/ButtonsMaterials.vue';

export default {
	components: { ListMaterials, ButtonsMaterials },
	// name: 'CreateMaterials',
};
</script>

<style scoped>
.tkt {
	width: 100%;
	text-align: center;
}
.cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}
</style>
