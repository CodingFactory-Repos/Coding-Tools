<template>
	<div class="h-full">
		<div class="flex flex-row justify-evenly items-center space-x-4 h-full">
			<div
				class="max-w-sm h-64 flex flex-col items-left justify-between p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<a href="#">
					<h5 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
						Journée Porte Ouverte
					</h5>
				</a>
				<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
					Retrouvez les differentes dates de Journée Porte Ouverte de l'ESIEE-IT avec les documents
					associés à ces dernières.
				</p>
				<button
					@click="openOpenHouses()"
					class="inline-flex w-fit items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					JPO
					<svg
						aria-hidden="true"
						class="w-4 h-4 ml-2 -mr-1"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>

			<div
				class="max-w-sm flex flex-col items-left justify-between h-64 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<a href="#">
					<h5 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
						Cours
					</h5>
				</a>
				<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
					Retrouvez les différents cours de la coding factory, trier par année et par matière. Vous
					y trouverez également les groupes de chaque sprint, avec des documents associés.
				</p>
				<button
					@click="openCours()"
					class="inline-flex w-fit items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Cours
					<svg
						aria-hidden="true"
						class="w-4 h-4 ml-2 -mr-1"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

// Get the router
const router = useRouter();

// Function to open the openHouses page
const openOpenHouses = () => {
	router.push(`/app/ressource/openhouse`);
};

const openCours = () => {
	router.push(`/app/ressource/cours`);
};
</script>
