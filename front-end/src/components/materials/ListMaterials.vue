<template>
	<div class="w-1/3 flex flex-col gap-4 h-full">
		<h1 class="text-2xl font-bold dark:text-dark-font">List of all materials</h1>
		<div class="w-full flex flex-wrap flex-row">
			<MaterialCard
				v-for="material in materials"
				:key="material.id"
				:name="material.name"
				:url="material.picture"
			/>
		</div>
	</div>
</template>

<script>
import MaterialCard from '@/components/materials/MaterialCard.vue';
import axios from 'axios';

export default {
	name: 'ListMaterials',
	components: { MaterialCard },
	data() {
		return {
			materials: [],
		};
	},
	created() {
		this.getMaterials();
	},
	methods: {
		getMaterials() {
			axios
				.get('http://localhost:8000/materials')
				.then((response) => {
					this.materials = response.data;
					console.log(this.materials);
				})
				.catch((error) => {
					console.log(error);
				});
		},
	},
};
</script>

<style scoped></style>
