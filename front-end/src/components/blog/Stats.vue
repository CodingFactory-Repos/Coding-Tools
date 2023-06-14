<template>
	<div>
		<canvas id="chart1"></canvas>
		<canvas id="chart2"></canvas>
		<canvas id="chart3"></canvas>
		<canvas id="chart4"></canvas>
	</div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user.store';
import { onMounted } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { Chart, DoughnutController, LinearScale, ArcElement } from 'chart.js';

Chart.register(DoughnutController);
Chart.register(ArcElement);
Chart.register(LinearScale);

console.log(useUserStore());
const createCharts = async () => {
	const articleStore = useArticleStore();
	const userStore = useUserStore();
	const articles = userStore.myArticles;
	const users = userStore.relatedProfiles;
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
	console.log(articleWithMostParticipants);

	const ctx1 = document.getElementById('chart1').getContext('2d');
	new Chart(ctx1, {
		type: 'doughnut',
		data: {
			labels: Object.keys(categoryCount),
			datasets: [
				{
					label: "Nombre d'articles",
					data: Object.values(categoryCount),
					backgroundColor: [
						'rgba(75, 192, 192, 0.6)',
						'rgba(192, 75, 75, 0.6)',
						'rgba(75, 192, 75, 0.6)',
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
	const ctx2 = document.getElementById('chart2').getContext('2d');
	new Chart(ctx2, {
		type: 'doughnut',
		data: {
			labels: articleData.map((article) => article.title),
			datasets: [
				{
					label: 'Nombre de participants',
					data: articleData.map((article) => article.participants),
					backgroundColor: [
						'rgba(75, 192, 192, 0.6)',
						'rgba(192, 75, 75, 0.6)',
						'rgba(75, 192, 75, 0.6)',
						'rgba(255, 159, 64, 0.6)',
						'rgba(54, 162, 235, 0.6)',
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
		const firstNames = (creator.firstName || []).filter(Boolean).join(' ');
		const lastNames = (creator.lastName || []).filter(Boolean).join(' ');
		const count = creator.count;
		return `${firstNames} ${lastNames} ${count}`;
	});

	console.log(formattedCreators);

	const ctx3 = document.getElementById('chart3').getContext('2d');
	new Chart(ctx3, {
		type: 'doughnut',
		data: {
			labels: formattedCreators.map((creator) => creator.split(' ')[0]), // Premiers prénoms
			datasets: [
				{
					data: formattedCreators.map((creator) => creator.split(' ')[2]), // Count
					backgroundColor: [
						'rgba(75, 192, 192, 0.6)',
						'rgba(192, 75, 75, 0.6)',
						'rgba(75, 192, 75, 0.6)',
						'rgba(255, 159, 64, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(255, 99, 132, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(255, 206, 86, 0.6)',
						'rgba(75, 192, 192, 0.6)',
						'rgba(192, 75, 75, 0.6)',
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

	console.log(formattedParticipants);

	const ctx4 = document.getElementById('chart4').getContext('2d');
	new Chart(ctx4, {
		type: 'doughnut',
		data: {
			labels: formattedParticipants.map((participant) => participant.split(' ')[0]), // Premiers prénoms
			datasets: [
				{
					data: formattedParticipants.map((participant) => participant.split(' ')[2]), // Count
					backgroundColor: [
						'rgba(75, 192, 192, 0.6)',
						'rgba(192, 75, 75, 0.6)',
						'rgba(75, 192, 75, 0.6)',
						'rgba(255, 159, 64, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(255, 99, 132, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(255, 206, 86, 0.6)',
						'rgba(75, 192, 192, 0.6)',
						'rgba(192, 75, 75, 0.6)',
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
