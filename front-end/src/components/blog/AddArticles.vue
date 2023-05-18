<template>
	<div class="text-center max-w-full w-4/5 m-auto h-full">
		<h2 class="text-3xl font-bold pt-5 text-gray-900">Create Article</h2>
		<form @submit.prevent="addArticle">
			<div class="grid gap-6 mb-6 md:grid-cols-2 justify-items-center">
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
							<option value="" selected disabled>Select type</option>
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
			<div class="mb-6 relative z-10">
				<div class="relative mb-6 flex">
					<mavon-editor
						language="fr"
						class="p-2.5 w-full text-sm z-1 text-gray-900 bg-white rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						v-model="descriptions"
					/>
				</div>
			</div>
			<div class="h-10 mb-6">
				<datepicker
					v-model="date"
					:full-month-name="true"
					placeholder="YYYY-MM-DD"
					:typeable="true"
					class="vuejs3-datepicker w-[300px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				/>
			</div>

			<div class="grid gap-6 mb-6 md:grid-cols-2 justify-items-center">
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

<script lang="ts" setup>
// Post the data to the API
import { ref, computed } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import datepicker from 'vuejs3-datepicker';
import Swal from 'sweetalert2';

// use router
import { useRouter } from 'vue-router';
const router = useRouter();

// use the store
const articleStore = useArticleStore();
const idArticle = computed(() => articleStore.idArticle);

const authStore = useAuthStore();

// form data
const title = ref('');
const picture = ref('');
const descriptions = ref('...');
const tags = ref('');
const type = ref('');
const date = ref(new Date());

// Function to post the data to the API
const addArticle = async () => {
	// add verification if all the fields are filled
	if (!title.value || !picture.value || !tags.value || !type.value || !descriptions.value) {
		Swal.fire({
			title: 'You have to fill all the fields',
			text: 'Please fill all the fields to create a new article',
			icon: 'error',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Ok',
		});
		return;
	}

	let data = {
		title: title.value,
		descriptions: descriptions.value,
		picture: picture.value,
		tags: tags.value,
		type: type.value,
		date: date.value.toString(),
	};

	Swal.fire({
		title: 'Your article has been created',
		icon: 'success',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Ok',
	}).then(async (result) => {
		if (result.isConfirmed) {
			// post the data
			await articleStore.addArticle(data);

			// add article in user database
			await authStore.addArticleToUser(idArticle.value);

			// redirect to the article page
			router.push('/app/blog');
		}
	});

	//reset the form
	title.value = '';
	descriptions.value = '...';
	picture.value = '';
	tags.value = '';
	type.value = '';
	date.value = new Date();
};
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
