<template>
	<BarChart
		:data="datas"
		label="name"
		value="days"
		caption="Nombre de jours d'utilisation"
		title="Les 5 équipements les plus utilisés par nombre de jours"
	/>
</template>
<script>
import BarChart from './BarChart.vue';

import { http } from '@/api/network/axios';

export default {
	data() {
		return {
			datas: [],
		};
	},
	async created() {
		console.log('usedList created');
		const { data: items } = await http.get(`/materials/usedList`);
		console.log(items);
		this.datas = items;
	},
	components: { BarChart },
};
</script>
