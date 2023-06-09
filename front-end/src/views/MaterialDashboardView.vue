<template>
	<div class="py-8">
		<h1 class="text-dark-primary dark:text-light-primary text-center">Dashboard de l'inventaire</h1>
		<div class="sm:grid sm:grid-cols-3 grid-cols-1 px-3 py-5 sm:gap-6 lg:py-10 lg:px-20">
			<DataOlderMaterials ref="bar" />
			<DataNbMaterials ref="doughnut" />
			<DataStatusMaterials ref="doughnut" />
			<DataUsedMaterials ref="bar" />
		</div>
	</div>
</template>

<script>
import DataOlderMaterials from './materialDashboard/OlderMaterials.vue';
import DataNbMaterials from './materialDashboard/NbMaterial.vue';
import DataUsedMaterials from './materialDashboard/UsedMaterial.vue';
import DataStatusMaterials from './materialDashboard/StatusMaterial.vue';

export default {
	name: 'App',
	components: { DataOlderMaterials, DataNbMaterials, DataUsedMaterials, DataStatusMaterials },
};
</script>
