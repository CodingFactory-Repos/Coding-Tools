<template>
	<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Synthesis</h3>
	<ul
		class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
	>
		<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
			<div class="flex items-center pl-3">
				<input
					id="horizontal-list-radio-license"
					type="radio"
					value=""
					name="list-radio"
					@click="getMostUsedMaterial"
					class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
				/>
				<label
					for="horizontal-list-radio-license"
					class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Most used materials
				</label>
			</div>
		</li>
		<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
			<div class="flex items-center pl-3">
				<input
					id="horizontal-list-radio-id"
					type="radio"
					value=""
					name="list-radio"
					@click="totalMaterialsByType"
					class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
				/>
				<label
					for="horizontal-list-radio-id"
					class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Total Mac</label
				>
			</div>
		</li>
		<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
			<div class="flex items-center pl-3">
				<input
					id="horizontal-list-radio-millitary"
					type="radio"
					value=""
					name="list-radio"
					@click="getOldestMaterial"
					class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
				/>
				<label
					for="horizontal-list-radio-millitary"
					class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Oldest Materials</label
				>
			</div>
		</li>
	</ul>

	<div v-if="usedGraph == true">
		<Doughnut :data="dataCollection" :options="options" />
	</div>
	<div v-if="totalGraph == true">
		<Pie :data="dataCollection" :options="options" />
	</div>
	<div v-if="oldestGraph == true">
		<Bar :data="dataCollection" :options="options" />
	</div>
	<div v-if="totalGraph == false && oldestGraph == false && usedGraph == false">
		<div class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Please, Choose a option !</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useMaterialStore } from '@/store/modules/material.store';
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
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'vue-chartjs';
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';
ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
);

const materialStore = useMaterialStore();
const materials = computed(() => materialStore.filteredMaterial);
const dataCollection = ref(null);
const totalGraph = ref(false);
const usedGraph = ref(false);
const oldestGraph = ref(false);
const options = ref(null);

const getMostUsedMaterial = () => {
	totalGraph.value = false;
	oldestGraph.value = false;
	usedGraph.value = true;
	const mostUsedMaterials = materials.value
		.sort((a, b) => {
			return b.borrowingHistory?.length - a.borrowingHistory?.length;
		})
		.slice(0, 5);

	const labels = mostUsedMaterials.map((material) => material.name);
	const data = mostUsedMaterials.map((material) => material.borrowingHistory?.length ?? 0);

	dataCollection.value = {
		labels: labels,
		datasets: [
			{
				label: 'Used',
				backgroundColor: ['#32a852', '#ed0e46', '#1cdee8', '#deda12', '#8b16f2'],
				data: data,
			},
		],
	};
	options.value = {
		responsive: true,
		maintainAspectRatio: false,
	};
};

const totalMaterialsByType = () => {
	usedGraph.value = false;
	oldestGraph.value = false;
	totalGraph.value = true;
	const totalMac = materials.value.filter((material) => material.type === 'Mac').length;
	const totalPC = materials.value.filter((material) => material.type === 'Hardware').length;
	const totalTablet = materials.value.filter((material) => material.type === 'Livre').length;

	dataCollection.value = {
		labels: ['Mac', 'Hardware', 'Book'],
		datasets: [
			{
				backgroundColor: ['#f87979', '#7acbf9', '#f9e07a'],
				data: [totalMac, totalPC, totalTablet],
			},
		],
	};
	options.value = {
		responsive: true,
		maintainAspectRatio: false,
	};
};

const getOldestMaterial = () => {
	totalGraph.value = false;
	usedGraph.value = false;
	oldestGraph.value = true;
	// Get only the 5 oldest materials
	const oldestMaterials = materials.value
		.sort((a, b) => {
			return new Date(a.acquisitionDate).getTime() - new Date(b.acquisitionDate).getTime();
		})
		.slice(0, 5);

	const labels = oldestMaterials.map((material) => material.name);
	const data = oldestMaterials.map((material) => {
		const date = new Date(material.acquisitionDate);
		// Return the day month and year
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	});

	dataCollection.value = {
		labels: labels,
		datasets: [
			{
				label: 'Date',
				backgroundColor: '#f87979',
				data: data,
			},
		],
	};
	options.value = {
		responsive: true,
		maintainAspectRatio: false,
		// Make it start a 2020
		scales: {
			y: {
				type: 'time',
				adapters: {
					date: {
						locale: fr,
					},
				},
			},
		},
	};
};
</script>
