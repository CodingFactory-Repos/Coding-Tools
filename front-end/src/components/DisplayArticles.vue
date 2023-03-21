<template>
	<div>
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold">Blog</h1>
			<!-- <button
				data-modal-target="defaultModal"
				data-modal-toggle="defaultModal"
				class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				type="button"
			>
				Create a materials
			</button> -->
		</div>
		<div class="text-center flex items-center justify-center max-w-full h-full">
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
				<div
					v-for="item in items"
					class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
				>
					<img
						class="object-cover h-48 w-96 rounded-t-lg"
						:src="
							item.picture && item.picture != ''
								? item.picture
								: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
						"
						alt=""
					/>
					<div class="pt-3 pb-2">
						<span
							class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
							>{{ item.type }}</span
						>
					</div>
					<div class="pt-2 pb-5">
						<a href="#">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{{ item.title ? item.title : 'Pas de titre spécifié' }}
							</h5>
						</a>
						<p
							v-for="description in descriptions"
							class="mb-3 p-3 font-normal text-gray-700 dark:text-gray-400"
						>
							{{ description.value }}
						</p>
						<a
							href="#"
							class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Read more
							<svg
								aria-hidden="true"
								class="w-4 h-4 ml-2 -mr-1"
								fill="white"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								></path>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.margin {
	width: fit-content;
}
</style>

<script lang="ts">
// Import axios
import axios from 'axios';

export default {
	data() {
		return {
			// An array to store articles data
			items: [],
			descriptions: [],
			showModal: false,
		};
	},
	created() {
		// Call the getArticles method when the component is created
		this.getArticles();
	},

	methods: {
		// Function to fetch data in articles collection from the DB
		async getArticles() {
			// Use axios to send a GET request to the backend
			const response = await axios
				.get('http://localhost:8010/articles/get')
				.then((response) => {
					console.log(response);
					// Update the `items` array with the response data
					this.items = response.data;
					this.descriptions = response.data[3].description;
					console.log('item', this.items);
					console.log('description', response.data[3].description[0]);
				})
				.catch((error) => {
					console.log(error);
				});
		},
	},
};
</script>
