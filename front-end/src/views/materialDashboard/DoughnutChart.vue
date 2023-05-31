<template>
	<div>
		<h2>{{ this.title }}</h2>
		<Doughnut
			id="my-chart-id"
			:option="chartOptions"
			:data="chartData"
			class="rounded-lg bg-light-tertiary dark:bg-dark-tertiary"
		/>
	</div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
	props: ['data', 'label', 'value', 'caption', 'title'],
	name: 'DoughnutChart',
	components: { Doughnut },
	data() {
		return {
			chartData: {
				labels: [],
				datasets: [
					{
						data: [],
					},
				],
			},
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false,
			},
		};
	},
	watch: {
		data: function () {
			this.getValues();
		},
	},
	methods: {
		getValues() {
			const { labels, data } = this.data.reduce(
				(acc, element) => {
					const { [this.label]: label, [this.value]: value } = element;
					const { labels, data } = acc;
					return { labels: [...labels, label], data: [...data, value] };
				},
				{
					labels: [],
					data: [],
				},
			);
			const chartData = {
				barName: this.title,
				labels,
				datasets: [
					{
						label: this.caption,
						backgroundColor: ['#462a5f', '#83397C'],
						data,
						borderWidth: 0,
					},
				],
			};
			this.chartData = chartData;
		},
	},
	async created() {
		console.log('created doug chart');
		this.getValues();
	},
};
</script>
