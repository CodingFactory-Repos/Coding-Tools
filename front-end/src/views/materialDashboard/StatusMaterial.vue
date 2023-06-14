<template>
	<DoughnutChart
		:data="datas"
		label="status"
		value="count"
		caption=""
		title="Nombre de macs empruntés"
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
		const { data: items } = await http.get(`/materials/statusMacs/Hardware`);
		this.datas = items;
	},
	components: { DoughnutChart },
};
</script>
