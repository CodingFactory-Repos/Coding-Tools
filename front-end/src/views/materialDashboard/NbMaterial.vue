<template>
	<DoughnutChart
		:data="datas"
		label="campus"
		value="count"
		caption=""
		title="Nombre de macs par campus"
		class=""
	/>
</template>
<script>
import DoughnutChart from './DoughnutChart.vue';

import { http } from '@/api/network/axios';

export default {
	data() {
		return {
			datas: [],
		};
	},
	async created() {
		const { data: items } = await http.get(`/materials/macs`);
		this.datas = items;
	},
	components: { DoughnutChart },
};
</script>
