<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="text-center max-w-full w-4/5 m-auto h-full">
		<h2 class="text-3xl font-bold pt-5 text-gray-900">Modification de l'article</h2>
		<form @submit.prevent="editArticle">
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
						>Type</label
					>
					<div class="relative mb-6">
						<select
							id="countries"
							class="form-control w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="type"
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
						v-model="descriptions"
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
					Modifier
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
import { computed, onMounted, ref, watch } from 'vue';

import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';

import datepicker from 'vuejs3-datepicker';
import Swal from 'sweetalert2';
import MarkdownIt from 'markdown-it';
import MarkdownViewer from './MarkdownViewer.vue';
import MarkdownItClass from '@toycode/markdown-it-class';

// use router
const router = useRouter();

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

// create renderMarkdown method
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

// use the store
const articleStore = useArticleStore();
const oneItems = computed(() => articleStore.oneItems);

const authStore = useAuthStore();

// get the id of the article from the url
const id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});

// get the article from his id
const getArticleById = async (id: string) => {
	await articleStore.getArticleById(id);
};

// form data
const title = ref('');
const picture = ref('');
const descriptions = ref('');
const content = ref('...');
const tags = ref('');
const type = ref('');
const date = ref(new Date());

// Watch to fill the form with the data of the article
watch(oneItems, (newVal) => {
	title.value = newVal.title;
	picture.value = newVal.picture;
	descriptions.value = newVal.descriptions;
	content.value = newVal.content;
	tags.value = newVal.tags;
	type.value = newVal.type;
	date.value = new Date(newVal.date);
});

// Function to post the data to the API
const editArticle = async () => {
	// add verification if all the fields are filled
	if (
		!title.value ||
		!picture.value ||
		!tags.value ||
		!type.value ||
		!descriptions.value ||
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
		_id: authStore.user._id,
		firstName: authStore.user.profile.firstName,
		lastName: authStore.user.profile.lastName,
	};

	// Groups all data for sending to the API
	let data = {
		owner: owner,
		title: title.value,
		descriptions: descriptions.value,
		content: content.value,
		picture: picture.value,
		tags: tags.value,
		type: type.value,
		date: date.value,
	};

	// Call update article function
	await articleStore.updateArticle(id.value, data);

	Swal.fire({
		title: 'Your article has been edited',
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
	descriptions.value = '';
	content.value = '...';
	picture.value = '';
	tags.value = '';
	type.value = '';
	date.value = new Date();
};

onMounted(() => {
	getArticleById(id.value);
});
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
