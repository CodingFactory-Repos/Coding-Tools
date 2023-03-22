<template>
	<div class="py-8">
		<h2 class="text-2xl font-bold mb-4">Open Houses</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<div
				v-for="openHouse in openHouses"
				:key="openHouse.id"
				class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<img :src="openHouse.picture" alt="" class="rounded-t-lg" />

				<div class="p-4">
					<h3 class="text-lg font-bold mb-2">{{ openHouse.title }}</h3>
					<p class="mb-2">
						<span class="font-bold">Date :</span> {{ formattedDate(openHouse.date) }}
					</p>
					<p class="mb-2">
						<span class="font-bold">Address :</span> {{ formattedAddress(openHouse.address) }}
					</p>
				</div>
				<div style="display: flex; justify-content: center; align-items: center">
					<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded">
						See more
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			openHouses: [],
		};
	},
	mounted() {
		axios
			.get('http://localhost:8010/openhouses')
			.then((response) => {
				this.openHouses = response.data;
			})
			.catch((error) => {
				console.log(error);
			});
	},
	methods: {
		// Change computed to methods
		formattedDate(date) {
			// Remove the check for openHouses length and accept date as a parameter
			const parsedDate = new Date(date);
			return parsedDate.toLocaleDateString('fr-FR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
		},
		formattedAddress(address) {
			// Remove the check for openHouses length and accept address as a parameter
			return `${address.street} ${address.city} ${address.zipCode}`;
		},
	},
};
</script>
