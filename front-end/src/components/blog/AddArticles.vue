<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="text-center max-w-full w-4/5 m-auto h-full">
		<h2 class="text-3xl font-bold pt-5 text-gray-900">Nouvel article</h2>
		<form @submit.prevent="addArticle">
			<div class="grid gap-6 my-6 md:grid-cols-2 justify-items-center">
				<div>
					<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
						>Titre</label
					>
					<div class="relative mb-6">
						<input
							type="text"
							id="title"
							class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Enter Title"
							v-model="title"
						/>
					</div>
				</div>
				<div>
					<label
						for="countries"
						class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
						>Type</label
					>
					<div class="relative mb-6">
						<select
							id="countries"
							class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="type"
							@change="changeType(type)"
						>
							<option value="" selected disabled>Sélectionner un type</option>
							<option value="Infos">Infos</option>
							<option value="Tuto">Tutoriel</option>
							<option value="Evenement">Événement</option>
						</select>
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

			<div class="flex flex-col items-center">
				<label for="countries" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
					>Importer votre fichier .md</label
				>
				<div class="relative mb-6">
					<input
						type="file"
						accept=".md"
						@change="handleFileChange"
						class="block w-full sm:w-30 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
						id="file_input"
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
						class="p-2.5 w-full text-sm z-1 text-gray-900 bg-white rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						defaultOpen="true"
					/>
				</div>
			</div>

			<div class="h-10 mb-6">
				<datepicker
					v-model="date"
					:full-month-name="true"
					placeholder="YYYY-MM-DD"
					:typeable="true"
					class="vuejs3-datepicker w-full sm:w-[300px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
				/>
			</div>

			<div class="grid gap-6 mb-6 md:grid-cols-2 justify-items-center">
				<div>
					<label for="picture" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
						>Image</label
					>
					<div class="relative mb-6">
						<input
							type="text"
							class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
							class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
		<div v-if="content">
			<div
				v-if="type !== 'Tuto'"
				class="text-left p-6 mt-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<div v-html="renderMarkdown()" class="markdown-preview text-gray-900 dark:text-white"></div>
			</div>
			<div v-else>
				<MarkdownViewer :markdown="content" :preview="true" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
// Post the data to the API
import { ref, watch } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';

import datepicker from 'vuejs3-datepicker';
import Swal from 'sweetalert2';
import MarkdownIt from 'markdown-it';
import MarkdownViewer from './MarkdownViewer.vue';
import MarkdownItClass from '@toycode/markdown-it-class';

// Define the options for the mavon editor
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

// Function to render the markdown
const renderMarkdown = () => {
	const md = new MarkdownIt();
	md.use(MarkdownItClass, {
		h1: 'text-4xl mt-5 mb-2 border-b border-gray-300 font-bold text-gray-900 dark:text-white',
		h2: 'text-3xl mt-5 mb-2 border-b border-gray-300 font-bold text-gray-900 dark:text-white',
		h3: 'text-2xl mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h4: 'text-xl mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h5: 'text-lg mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h6: 'text-base mt-5 mb-2 font-bold text-gray-500 dark:text-white',
		img: 'max-w-[25rem] m-auto h-auto mt-7 mb-7',
		p: 'text-gray-900 mt-2 mb-2 dark:text-white',
	});

	return md.render(content.value);
};

// use router
const router = useRouter();

// use the store
const articleStore = useArticleStore();
const authStore = useAuthStore();

// form data
const title = ref('');
const picture = ref('');
const description = ref('');
const content = ref('...');
const tags = ref('');
const type = ref('');
const status = ref('');
const date = ref(new Date());
const fileContent = ref();

// function to have type when is selected in the select
const changeType = (value: string) => {
	type.value = value;
	if (value == 'tuto') {
		status.value = 'pending';
	} else {
		status.value = 'validated';
	}
};

// Function to watch the content of the file
watch(content, (newContent) => {
	content.value = newContent;
});

// Function to handle the file change and get the content of the file
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
	if (
		!title.value ||
		!picture.value ||
		!tags.value ||
		!type.value ||
		!description.value ||
		!content.value
	) {
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

	const owner = {
		_id: authStore?.user?._id,
		firstName: authStore?.user?.profile?.firstName,
		lastName: authStore?.user?.profile?.lastName,
	};

	// Groups all data for sending to the API
	if (type.value == 'Infos') {
		let data = {
			owner: owner,
			title: title.value,
			descriptions: description.value,
			content: content.value,
			picture: picture.value,
			tags: tags.value,
			type: type.value,
			status: status.value,
			date: date.value,
			likes: [],
			dislikes: [],
		};

		// post the data
		await articleStore.addArticle(data);
	} else if (tags.value.toUpperCase() == 'JPO') {
		let data = {
			owner: owner,
			title: title.value,
			descriptions: description.value,
			content: content.value,
			picture: picture.value,
			tags: tags.value,
			type: type.value,
			status: status.value,
			date: date.value,
			likes: [],
			dislikes: [],
			participants: [],
			comments: [],
			documents: [],
		};

		// post the data
		await articleStore.addArticle(data);
	} else {
		let data = {
			owner: owner,
			title: title.value,
			descriptions: description.value,
			content: content.value,
			picture: picture.value,
			tags: tags.value,
			type: type.value,
			status: status.value,
			date: date.value,
			likes: [],
			dislikes: [],
			participants: [],
			comments: [],
		};

		// post the data
		await articleStore.addArticle(data);
	}

	Swal.fire({
		title: 'Your article has been created',
		icon: 'success',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Ok',
	}).then(async (result) => {
		if (result.isConfirmed) {
			router.push('/app/blog');
		}
	});

	//reset the form
	title.value = '';
	description.value = '';
	content.value = '...';
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
