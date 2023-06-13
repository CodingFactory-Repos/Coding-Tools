<template>
	<div class="text-center p-6 dark:text-white">
		<form @submit.prevent="addComment(oneItems._id)">
			<div>
				<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
					>Titre</label
				>
				<div class="relative mb-6">
					<input
						type="text"
						id="title"
						class="form-control w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Écrire un titre..."
						v-model="title"
					/>
				</div>
			</div>
			<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
				>Commentaire</label
			>
			<div class="mb-6">
				<textarea
					type="text"
					v-model="descriptions"
					rows="1"
					class="p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Écrire un commentaire..."
				></textarea>
			</div>

			<div>
				<button
					type="submit"
					class="text-gray-900 bg-light-primary border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
				>
					Créer
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
import Swal from 'sweetalert2';

// use the store
const articleStore = useArticleStore();
const oneItems = computed(() => articleStore.oneItems);

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// form data
const title = ref('');
const descriptions = ref('');

// Function to post the data to the API
const addComment = async (id) => {
	// add verification if all the fields are filled
	if (!title.value || !descriptions.value) {
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

	const date = new Date();

	let data = {
		title: title.value,
		descriptions: descriptions.value,
		date: date,
		email: user.value.profile.email,
		firstName: user.value.profile.firstName,
		lastName: user.value.profile.lastName,
		picture: user.value.profile.picture,
	};

	//reset the form
	title.value = '';
	descriptions.value = '';

	Swal.fire({
		title: 'Your article has been created',
		icon: 'success',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Ok',
	}).then(async (result) => {
		if (result.isConfirmed) {
			await articleStore.addComment(id, data);
		}
	});
};
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
