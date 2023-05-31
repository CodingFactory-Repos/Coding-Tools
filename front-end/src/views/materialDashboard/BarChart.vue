<template>
	<div class="col-span-2">
		<h2>{{ this.title }}</h2>
		<Bar
			id="my-chart-id"
			:option="chartOptions"
			:data="chartData"
			class="rounded-lg bg-light-tertiary dark:bg-dark-tertiary"
		/>
	</div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
	props: ['data', 'label', 'value', 'caption', 'title'],
	name: 'BarChart',
	components: { Bar },
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
			console.log(this.data);
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
						backgroundColor: ['#462a5f', '#65326D', '#83397C', '#A2418A', '#C04898'],
						data,
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
