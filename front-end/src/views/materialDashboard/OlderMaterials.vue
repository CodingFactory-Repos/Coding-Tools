<template>
	<BarChart
		:data="datas"
		label="name"
		value="days"
		caption="Nombre de jours depuis l'acquisition"
		title="Les 5 équipements les plus vieux par nombre de jours"
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
		const { data: items } = await http.get(`/materials/stats`);
		const datas = items.map(({ acquisitionDate, name }) => {
			const today = +Date.now();
			const acquisition = +new Date(acquisitionDate);
			const days = Math.floor((today - acquisition) / 864e5);
			return { name, days };
		});
		this.datas = datas;
	},
	components: { BarChart },
};
</script>

// [{name: "Macbook", days: 164},{name: "Macbook", days: 164},{name: "Macbook", days: 164},{name:
"Macbook", days: 164}]
