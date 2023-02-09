<template>
	<div>
		<div>
			<h1 class="text-4xl font-bold">Articles</h1>
			<p class="text-lg">Here are the articles</p>
		</div>
		<div class="text-center flex items-center justify-center max-w-full h-full">
			<div
				v-for="item in items"
				class="max-w-sm bg-white mr-4 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<a href="#">
					<!-- See if there is a link in DB -->
					<img
						v-if="item.picture && item.picture != ''"
						class="rounded-t-lg"
						:src="item.picture"
						alt=""
					/>
					<!-- Put a default image if there isn't have link in DB -->
					<img
						v-else
						class="rounded-t-lg"
						src="https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png"
						alt=""
					/>
				</a>
				<div class="p-5">
					<a href="#">
						<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{{ item.title }}
						</h5>
					</a>
					<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
						{{ item.description }}
					</p>
					<a
						href="#"
						class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Read more =>
					</a>
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
				})
				.catch((error) => {
					console.log(error);
				});
		},
	},
};
</script>
