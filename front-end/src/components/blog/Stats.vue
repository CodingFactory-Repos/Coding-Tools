<template>
	<div>
		<canvas id="chart1"></canvas>
		<canvas id="chart2"></canvas>
		<canvas id="chart3"></canvas>
	</div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user.store';
import { onMounted } from 'vue';
import Chart from 'chart.js';

const createCharts = () => {
	const userStore = useUserStore();
	const articles = userStore.myArticles;
	const users = userStore.relatedProfiles;

	console.log(articles);

	const countByType = articles.reduce((count, article) => {
		count[article.type] = (count[article.type] || 0) + 1;
		return count;
	}, {});

	const countParticipantsByEvent = articles
		.filter((article) => article.type === 'Evenement')
		.map((article) => article.participants?.length || 0);

	const countEventsParticipationByUser = users.map((user) => user.article.participants?.length || 0);

	const ctx1 = document.getElementById('chart1');
	new Chart(ctx1, {
		type: 'bar',
		data: {
			labels: Object.keys(countByType),
			datasets: [
				{
					label: "Nombre d'articles",
					data: Object.values(countByType),
					backgroundColor: 'rgba(75, 192, 192, 0.6)',
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
					beginAtZero: true,
					precision: 1,
				},
			},
		},
	});

	const ctx2 = document.getElementById('chart2');
	new Chart(ctx2, {
		type: 'bar',
		data: {
			labels: Array.from(Array(countParticipantsByEvent.length).keys()),
			datasets: [
				{
					label: 'Nombre de participants',
					data: countParticipantsByEvent,
					backgroundColor: 'rgba(192, 75, 192, 0.6)',
					borderColor: 'rgba(192, 75, 192, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
					precision: 0,
				},
			},
		},
	});

	const ctx3 = document.getElementById('chart3');
	new Chart(ctx3, {
		type: 'bar',
		data: {
			labels: Array.from(Array(countEventsParticipationByUser.length).keys()),
			datasets: [
				{
					label: "Nombre d'événements",
					data: countEventsParticipationByUser,
					backgroundColor: 'rgba(192, 192, 75, 0.6)',
					borderColor: 'rgba(192, 192, 75, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
					precision: 0,
				},
			},
		},
	});
};

onMounted(createCharts);
</script>
