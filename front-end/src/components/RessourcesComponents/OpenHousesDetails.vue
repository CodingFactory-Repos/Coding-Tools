<template>
	<div class="py-8">
		<h2 class="text-2xl font-bold mb-4">{{ openHouse.title }}</h2>
		<div
			class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
			<img :src="openHouse.picture" alt="" class="rounded-t-lg" />
			<div class="p-4">
				<p class="mb-2">
					<span class="font-bold">Date :</span> {{ formattedDate(openHouse.date) }}
				</p>
				<p class="mb-2">
					<span class="font-bold">Address :</span> {{ formattedAddress(openHouse.address) }}
				</p>
				<p class="mb-2">{{ openHouse.description }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			openHouse: {},
		};
	},
	mounted() {
		axios
			.get(`http://localhost:8010/openhouses/${this.$route.params.id}`)
			.then((response) => {
				this.openHouse = response.data;
			})
			.catch((error) => {
				console.log(error);
			});
	},
	methods: {
		formattedDate(date) {
			const parsedDate = new Date(date);
			return parsedDate.toLocaleDateString('fr-FR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
		},
		formattedAddress(address) {
			return `${address.street} ${address.city} ${address.zipCode}`;
		},
	},
};
</script>
