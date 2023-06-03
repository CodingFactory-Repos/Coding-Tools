<template>
	<div class="py-8">
		<h1 class="text-dark-primary dark:text-light-primary text-center">Inventory Dashboard</h1>
		<div class="grid grid-cols-3 gap-6 py-10 px-20">
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
