<template>
	<div id="createTutorialContainer" class="flex flex-col gap-5">
		<div class="text-center max-w-full w-4/5 m-auto h-full">
			<h2 class="text-3xl font-bold pt-5 text-gray-900">Créer un Tutoriel</h2>
			<form @submit.prevent="addArticle">
				<div class="grid gap-6 mb-6 md:grid-cols-2 justify-items-center">
					<div>
						<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
							>Titre</label
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
							>Importer votre fichier .md</label
						>
						<div class="relative mb-6">
							<input
								type="file"
								accept=".md"
								@change="handleFileChange"
								class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
								id="file_input"
							/>
						</div>
					</div>
				</div>

				<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
					>Description</label
				>
				<div class="mb-6 relative z-10">
					<div class="relative mb-6 flex">
						<input
							type="text"
							language="fr"
							class="p-2.5 w-full text-sm z-1 text-gray-900 bg-white rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="description"
						/>
					</div>
				</div>

				<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
					>Contenu</label
				>
				<div class="mb-6 relative z-10">
					<div class="relative mb-6 flex">
						<mavon-editor
							v-model="content"
							:toolbars="mavonOptions"
							language="fr"
							class="p-2.5 w-full text-sm z-1 text-gray-900 bg-white rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							defaultOpen="true"
						/>
					</div>
				</div>

				<div class="grid gap-6 mb-6 md:grid-cols-2 justify-items-center">
					<div>
						<label
							for="picture"
							class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
							>Image</label
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
						Créer
					</button>
				</div>
			</form>
		</div>
		<div v-if="content">
			<MarkdownViewer :markdown="content" />
		</div>
	</div>
</template>

<script lang="ts" setup>
// Post the data to the API
import { ref, watch } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import Swal from 'sweetalert2';
import MarkdownViewer from './MarkdownViewer.vue';

// use router
import { useRouter } from 'vue-router';

const router = useRouter();

// use the store
const articleStore = useArticleStore();
const authStore = useAuthStore();

// form data
const title = ref('');
const picture = ref('');
const description = ref('');
const content = ref('');
const tags = ref('');
const type = ref('');
const date = ref(new Date());

// page functionnality
const fileContent = ref();
const mavonOptions = ref({
	bold: true,
	italic: true,
	header: true,
	underline: true,
	strikethrough: true,
	mark: true,
	superscript: true,
	subscript: true,
	quote: true,
	ol: true,
	ul: true,
	link: true,
	imagelink: true,
	code: true,
	table: true,
});

watch(content, (newContent) => {
	content.value = newContent;
});

const handleFileChange = (event) => {
	const file = event.target.files[0];

	if (file) {
		const reader = new FileReader();
		reader.onload = () => {
			fileContent.value = reader.result;
			content.value = reader.result.toString();
		};
		reader.readAsText(file);
	}
};

// Function to post the data to the API
const addArticle = async () => {
	// add verification if all the fields are filled
	if (!title.value || !tags.value || !description.value || !content.value || !picture.value) {
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
		owner: authStore.user._id,
		title: title.value,
		descriptions: description.value,
		content: content.value,
		tags: tags.value,
		type: 'Tuto',
		status: 'pending',
		picture: picture.value,
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
			// redirect to the article page
			router.push('/app/blog');
		}
	});

	//reset the form
	title.value = '';
	description.value = '';
	content.value = '';
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
