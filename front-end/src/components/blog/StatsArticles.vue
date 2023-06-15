<template>
	<div class="w-full h-auto grid grid-cols-2 gap-10 m-5">
		<div class="flex flex-col items-center">
			<h1 class="text-3xl text-black mb-5 dark:text-white">Nombres d'articles par type</h1>
			<div class="border border-gray-500 p-3 rounded-xl dark:border-white">
				<canvas id="chart1" width="300" height="300"></canvas>
			</div>
		</div>
		<div class="flex flex-col items-center">
			<h1 class="text-3xl text-black mb-5 dark:text-white">
				Événements avec le plus de participants
			</h1>
			<div class="border border-gray-500 p-3 rounded-xl dark:border-white">
				<canvas id="chart2" width="300" height="300"></canvas>
			</div>
		</div>
		<div class="flex flex-col items-center">
			<h1 class="text-3xl text-black mb-5 dark:text-white">
				Étudiants ayant créé le plus d'articles
			</h1>
			<div class="border border-gray-500 p-3 rounded-xl dark:border-white">
				<canvas id="chart3" width="300" height="300"></canvas>
			</div>
		</div>
		<div class="flex flex-col items-center">
			<h1 class="text-3xl text-black mb-5 dark:text-white">Étudiants participant aux évènements</h1>
			<div class="border border-gray-500 p-3 rounded-xl dark:border-white">
				<canvas id="chart4" width="300" height="300"></canvas>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	ArcElement,
	LinearScale,
	TimeScale,
	DoughnutController,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	DoughnutController,
);

const createCharts = async () => {
	const articleStore = useArticleStore();
	const articles2 = articleStore.getArticle();
	const response = await articles2;
	const types = response.map((article) => article.type);

	function countCategories(categories) {
		const count = {};
		for (const category of categories) {
			count[category] = (count[category] || 0) + 1;
		}
		return count;
	}

	const categoryCount = countCategories(types);

	const articleWithMostParticipants = await articleStore.getArticleWithMostParticipants();
	const articleData = articleWithMostParticipants.map((article) => ({
		title: article.title,
		participants: article.nombreparticipant,
	}));

	const ctx1 = (document.getElementById('chart1') as HTMLCanvasElement).getContext('2d');
	new ChartJS(ctx1, {
		type: 'doughnut',
		data: {
			labels: Object.keys(categoryCount),
			datasets: [
				{
					label: "Nombre d'articles",
					data: Object.values(categoryCount),
					backgroundColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(192, 75, 75, 1)',
						'rgba(75, 192, 75, 1)',
					],
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					min: 0,
					beginAtZero: true,
					ticks: {
						stepSize: 1,
						precision: 0,
					},
				},
			},
		},
	});

	const ctx2 = (document.getElementById('chart2') as HTMLCanvasElement).getContext('2d');
	new ChartJS(ctx2, {
		type: 'doughnut',
		data: {
			labels: articleData.map((article) => article.title),
			datasets: [
				{
					label: 'Nombre de participants',
					data: articleData.map((article) => article.participants),
					backgroundColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(192, 75, 75, 1)',
						'rgba(75, 192, 75, 1)',
						'rgba(255, 159, 64, 1)',
						'rgba(54, 162, 235, 1)',
					],
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					min: 0,
					beginAtZero: true,
					ticks: {
						stepSize: 1,
						precision: 0,
					},
				},
			},
		},
	});
	const topCreators = await articleStore.getTopCreateur();

	const formattedCreators = topCreators.slice(0, 10).map((creator) => {
		const firstName = creator.firstName || '';
		const lastName = creator.lastName || '';
		const count = creator.count;
		return `${firstName} ${lastName} (${count} articles créés)`;
	});

	const ctx3 = (document.getElementById('chart3') as HTMLCanvasElement).getContext('2d');
	new ChartJS(ctx3, {
		type: 'doughnut',
		data: {
			labels: formattedCreators.map((creator) => creator), // Noms complets
			datasets: [
				{
					data: formattedCreators.map((creator) => {
						const countIndex = creator.lastIndexOf('(') + 1;
						return parseInt(creator.substring(countIndex, creator.length - 14));
					}), // Count
					backgroundColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(192, 75, 75, 1)',
						'rgba(75, 192, 75, 1)',
						'rgba(255, 159, 64, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 99, 132, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(192, 75, 75, 1)',
					],
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					min: 0,
					beginAtZero: true,
					ticks: {
						stepSize: 1,
						precision: 0,
					},
				},
			},
		},
	});

	const topParticipants = await articleStore.getTopParticipant();
	const formattedParticipants = topParticipants.slice(0, 10).map((participant) => {
		const firstName = participant.firstName || '';
		const lastName = participant.lastName || '';
		const count = participant.count;
		return `${firstName} ${lastName} ${count}`;
	});

	const ctx4 = (document.getElementById('chart4') as HTMLCanvasElement).getContext('2d');
	new ChartJS(ctx4, {
		type: 'doughnut',
		data: {
			labels: formattedParticipants.map((participant) => participant.split(' ')[0]), // Premiers prénoms
			datasets: [
				{
					data: formattedParticipants.map((participant) => participant.split(' ')[2]), // Count
					backgroundColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(192, 75, 75, 1)',
						'rgba(75, 192, 75, 1)',
						'rgba(255, 159, 64, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 99, 132, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(192, 75, 75, 1)',
					],
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					min: 0,
					beginAtZero: true,
					ticks: {
						stepSize: 1,
						precision: 0,
					},
				},
			},
		},
	});
};

onMounted(createCharts);
</script>
