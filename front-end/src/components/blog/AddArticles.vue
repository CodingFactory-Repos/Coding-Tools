<template>
	<div class="margin text-center p-6 bg-light-primary border border-gray-200 rounded-lg shadow-md">
		<form @submit.prevent="addArticle">
			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<div>
					<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
						>Title</label
					>
					<div class="relative mb-6">
						<input
							type="text"
							id="title"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Enter Title"
							v-model="title"
						/>
					</div>
				</div>
				<div>
					<label
						for="countries"
						class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
						>Select an option</label
					>
					<div class="relative mb-6">
						<select
							id="countries"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="type"
						>
							<option value="Infos">Infos</option>
							<option value="Tuto">Tuto</option>
							<option value="Evenement">Evenement</option>
						</select>
					</div>
				</div>
			</div>
			<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
				>Description</label
			>
			<div class="mb-6">
				<div v-for="(description, index) in descriptions" :key="index">
					<div class="relative mb-6 flex">
						<textarea
							type="text"
							v-model="description.value"
							rows="1"
							class="p-2.5 w-4/5 text-sm text-gray-900 bg-white rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Enter text or image url"
						/>

						<select
							v-model="description.type"
							class="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						>
							<option value="text">Text</option>
							<option value="image">Image</option>
						</select>
					</div>
				</div>
			</div>
			<button
				type="button"
				class="text-gray-900 bg-light-primary border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
				@click="addDescription"
			>
				Add Description
			</button>

			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<div>
					<label for="picture" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
						>Picture</label
					>
					<div class="relative mb-6">
						<input
							type="text"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							id="picture"
							v-model="picture"
							placeholder="Enter picture link"
						/>
					</div>
				</div>
				<div>
					<label for="tags" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
						>Tags</label
					>
					<div class="relative mb-6">
						<input
							type="text"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							id="tags"
							v-model="tags"
							placeholder="Enter tags"
						/>
					</div>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="text-gray-900 bg-light-primary border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
				>
					Create
				</button>
			</div>
		</form>
	</div>
</template>

<style scoped>
.margin {
	width: fit-content;
}
</style>

<script lang="ts" setup>
// Post the data to the API
import { ref } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';

// use the store
const articleStore = useArticleStore();

// form data
const title = ref('');
const descriptions = ref([{ type: 'text', value: '' }]);
const picture = ref('');
const tags = ref('');
const type = ref('');

// Function to add description object to the array
const addDescription = () => {
	descriptions.value.push({ type: 'text', value: '' });
};

// Function to post the data to the API
const addArticle = async () => {
	let data = {
		title: title.value,
		descriptions: descriptions.value,
		picture: picture.value,
		tags: tags.value,
		type: type.value,
	};

	// post the data
	await articleStore.addArticle(data);

	//reset the form
	title.value = '';
	descriptions.value = [{ type: 'text', value: '' }];
	picture.value = '';
	tags.value = '';
	type.value = '';
};

// export default {
// 	name: 'CreateMaterials',
// 	components: {
// 		ModalOverlay,
// 	},
// 	data() {
// 		return {
// 			title: '',
// 			descriptions: [{ type: 'text', value: '' }],
// 			picture: '',
// 			tags: '',
// 			type: '',
// 			showMetaModal: false,

// 		};
// 	},
// 	methods: {
// 		//Create a POST with axios
// 		addDescription() {
// 			this.descriptions.push({ type: 'text', value: '' });
// 		},
// 		addArticle() {
// 			// ! This will crash the front in case of reject.
// 			// ! You're also using axios without the instance.
// 			// ! So with credentials is false and the the cookie token will not be attached to the request.
// 			// ! Consider using : http.post('/articles/add', { ... })
// 			// ! And for the catch : addArticle: withErrorHandler(async function() { ... } );
// 			axios
// 				.post('http://localhost:8010/articles/add', {
// 					title: this.title,
// 					descriptions: this.descriptions,
// 					picture: this.picture,
// 					tags: this.tags,
// 					type: this.type,
// 				})
// 				.then((response) => {
// 					console.log(response);
// 				})
// 				.catch((error) => {
// 					console.log(error);
// 				});
// 			// Reset the form
// 			this.title = '';
// 			this.descriptions = [{ type: 'text', value: '' }];

// 			this.picture = '';
// 			this.tags = '';
// 			this.type = '';
// 		},
// 		beforeModalClose() {
// 			closeMetaModal();

// 				emit('close');
// 		},
// 	};
</script>
