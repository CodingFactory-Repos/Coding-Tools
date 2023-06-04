<template>
	<div>
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold">Ressources</h1>
		</div>
		<div class="flex justify-center items-center space-x-4">
			<div
				class="w-40 h-40 bg-blue-500 rounded-lg p-4 text-center cursor-pointer"
				@click="openOpenHouses()"
			>
				<div class="text-white text-4xl">
					<svg class="w-12 h-12 mx-auto" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12 6a1 1 0 0 1 .707.293l4 4A1 1 0 0 1 17 12v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 .293-.707l4-4A1 1 0 0 1 12 6z"
						/>
						<path
							fill="currentColor"
							d="M9 16a1 1 0 0 0 2 0v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0v-6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v6z"
						/>
					</svg>
				</div>
				<div class="text-white text-lg mt-2">Open House</div>
			</div>

			<div
				class="w-40 h-40 bg-green-500 rounded-lg p-4 text-center cursor-pointer"
				@click="openCours()"
			>
				<div class="text-white text-4xl">
					<svg class="w-12 h-12 mx-auto" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13H7v2h6V7zm0 4H7v2h6v-2zm0 4H7v2h6v-2z"
						/>
					</svg>
				</div>
				<div class="text-white text-lg mt-2">Cours</div>
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
