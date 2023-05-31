<template>
	<div class="m-3">
		<h1 style="text-align: center">Materials Dashboard</h1>
		<div class="grid grid-cols-3 gap-4">
			<DataOlderMaterials ref="bar" />
			<DataNbMaterials ref="doughnut" />
		</div>
	</div>
</template>

<script>
import DataOlderMaterials from './materialDashboard/OlderMaterials.vue';
import DataNbMaterials from './materialDashboard/NbMaterial.vue';

export default {
	name: 'App',
	components: { DataOlderMaterials, DataNbMaterials },
};
</script>
