<template>
	<div class="text-center flex items-center justify-center max-w-full h-full">
		<div class="margin p-6 bg-white border border-gray-200 rounded-lg shadow-md">
			<h1 class="text-4xl mb-6 font-extrabold dark:text-white">Create Article</h1>
			<form @submit.prevent="addArticle">
				<div class="form-group flex flex-col items-center">
					<label for="title" class="block text-lg font-medium text-gray-900 dark:text-white"
						>Title</label
					>
					<div class="relative mb-6">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								aria-hidden="true"
								class="w-5 h-5 text-gray-500 dark:text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
								></path>
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
							</svg>
						</div>
						<input
							type="text"
							id="title"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Enter Title"
							v-model="title"
						/>
					</div>
				</div>

				<div class="form-group flex flex-col items-center">
					<label for="countries" class="block text-lg font-medium text-gray-900 dark:text-white"
						>Select an option</label
					>
					<div class="relative mb-6">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								aria-hidden="true"
								class="w-5 h-5 text-gray-500 dark:text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
								></path>
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
							</svg>
						</div>
						<select
							id="countries"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="type"
						>
							<option value="Infos">Infos</option>
							<option value="Tuto">Tuto</option>
							<option value="Evenement">Evenement</option>
						</select>
					</div>
				</div>

				<div class="form-group flex flex-col items-center">
					<label for="description" class="block text-lg font-medium text-gray-900 dark:text-white"
						>Description</label
					>
					<div class="relative mb-6">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								aria-hidden="true"
								class="w-5 h-5 text-gray-500 dark:text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
								></path>
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
							</svg>
						</div>
						<textarea
							type="text"
							id="description"
							v-model="description"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Enter description"
						/>
					</div>
				</div>

				<div class="form-group flex flex-col items-center">
					<label for="picture" class="block text-lg font-medium text-gray-900 dark:text-white"
						>Picture</label
					>
					<div class="relative mb-6">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								aria-hidden="true"
								class="w-5 h-5 text-gray-500 dark:text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
								></path>
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
							</svg>
						</div>
						<input
							type="text"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							id="picture"
							v-model="picture"
							placeholder="Enter picture link"
						/>
					</div>
				</div>

				<div class="form-group flex flex-col items-center">
					<label for="tags" class="block text-lg font-medium text-gray-900 dark:text-white"
						>Tags</label
					>
					<div class="relative mb-6">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								aria-hidden="true"
								class="w-5 h-5 text-gray-500 dark:text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
								></path>
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
							</svg>
						</div>
						<input
							type="text"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							id="tags"
							v-model="tags"
							placeholder="Enter tags"
						/>
					</div>
				</div>

				<button
					type="submit"
					class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
				>
					Create
				</button>
			</form>
		</div>
	</div>
</template>

<style scoped>
.margin {
	width: fit-content;
}
</style>

<script lang="ts">
// Post the data to the API
import axios from 'axios';

export default {
	name: 'CreateMaterials',
	data() {
		return {
			title: '',
			description: '',
			picture: '',
			tags: '',
			type: '',
		};
	},
	methods: {
		//Create a POST with axios
		addArticle() {
			axios
				.post('http://localhost:8000/articles/add', {
					title: this.title,
					description: this.description,
					picture: this.picture,
					tags: this.tags,
					type: this.type,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
			// Reset the form
			this.title = '';
			this.description = '';
			this.picture = '';
			this.tags = '';
			this.type = '';
		},
	},
};
</script>
