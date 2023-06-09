<template>
	<div class="rounded-lg bg-light-tertiary dark:bg-dark-tertiary p-8 shadow-md">
		<h2 class="text-dark-primary dark:text-light-primary">{{ this.title }}</h2>
		<Doughnut id="my-chart-id" :options="chartOptions" :data="chartData" class="" />
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
				maintainAspectRatio: true,
				plugins: {
					legend: {
						display: true,
						labels: {
							color: '#5c5f73',
							boxWidth: 20,
							boxHeight: 20,
							usePointStyle: true,
							pointStyle: 'circle',
						},
					},
				},
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
						backgroundColor: ['#462a5f', '#C04898'],
						data,
						borderWidth: 0,
					},
				],
			};
			this.chartData = chartData;
		},
	},
	async created() {
		this.getValues();
	},
};
</script>
