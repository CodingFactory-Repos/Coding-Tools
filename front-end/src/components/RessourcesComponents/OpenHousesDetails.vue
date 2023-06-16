<template>
	<div class="text-center max-w-full h-full">
		<ModalOverlay v-if="addDocumentModal" @close="closeDocumentModal" size="2xl">
			<template #body>
				<div class="text-center p-6 dark:text-white">
					<form @submit.prevent="addDocument(article._id)">
						<div>
							<label
								for="title"
								class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
								>Titre</label
							>
							<div class="relative mb-6">
								<input
									type="text"
									id="title"
									class="form-control w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Écrire un titre..."
									v-model="name"
								/>
							</div>
						</div>
						<label for="title" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
							>Commentaire</label
						>
						<div class="mb-6">
							<input
								type="text"
								v-model="link"
								rows="1"
								class="p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Écrire un commentaire..."
							/>
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
		</ModalOverlay>
		<div class="text-center mt-10">
			<h1 class="text-4xl font-bold text-black dark:text-white">
				JPO du {{ new Date(article.date).toLocaleDateString('fr-FR') }}
			</h1>
			<button
				type="submit"
				@click="router.push('/app/ressource/openhouse')"
				class="font-bold rounded-lg text-xs md:text-sm px-3 py-2 mt-3 focus:outline-none gap-2 bg-blue-700"
			>
				<span class="text-white"> Toutes les JPO </span>
			</button>
		</div>
		<div class="flex items-center justify-evenly h-4/5">
			<div
				class="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<CardArticle :item="article" />
			</div>
			<div>
				<div
					v-for="(document, i) in article.documents"
					:key="document.name"
					class="relative flex flex-row items-center max-w-sm mb-4 dark:border-gray-700"
				>
					<button
						type="button"
						@click="deleteDocument(article._id, document)"
						class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs p-2 mr-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
					>
						<DeleteLogo />
					</button>
					<div
						class="max-w-sm text-left p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
					>
						<a :href="document.link" target="_blank">
							<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								Document {{ i + 1 }} : {{ document.name }}
							</h5>
						</a>
					</div>
				</div>
				<div
					class="max-w-sm p-3 border-4 border-dashed border-gray-300 rounded-lg shadow dark:bg-gray-800 dark:border-gray-400"
				>
					<button
						@click="openAddDocumentModal()"
						class="flex flex-row items-center justify-evenly w-full"
					>
						<Add class="!fill-gray-400" />
						<h5 class="text-2xl font-bold tracking-tight text-gray-400">add Document</h5>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CardArticle from '../blog/CardArticle.vue';
import { useArticleStore } from '@/store/modules/article.store';
import ModalOverlay from '@/components/common/Modal.vue';
import Swal from 'sweetalert2';
import Add from '../common/svg/Add.vue';
import DeleteLogo from '../common/svg/DeleteLogo.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// get store
const articlesStore = useArticleStore();
const article = computed(() => articlesStore.oneItems);

// get id from url
const _id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});

const addDocumentModal = ref(false);

const openAddDocumentModal = () => {
	addDocumentModal.value = true;
};

const closeDocumentModal = () => {
	addDocumentModal.value = false;
};

// form data
const name = ref('');
const link = ref('');

// Function to post the data to the API
const addDocument = async (id) => {
	// add verification if all the fields are filled
	if (!name.value || !link.value) {
		Swal.fire({
			title: 'You have to fill all the fields',
			text: 'Please fill all the fields to add a new document',
			icon: 'error',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Ok',
		});
		return;
	}

	let data = {
		name: name.value,
		link: link.value,
	};

	//reset the form
	name.value = '';
	link.value = '';

	Swal.fire({
		title: 'Your document has been added',
		icon: 'success',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Ok',
	}).then(async (result) => {
		if (result.isConfirmed) {
			await articlesStore.addDocument(id, data);
			closeDocumentModal();
		}
	});
};

const deleteDocument = async (id, document) => {
	const documentRemoved = {
		_id: document._id,
		name: document.name,
		link: document.link,
	};

	Swal.fire({
		title: 'Are you sure?',
		text: 'You will not be able to recover this document!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'Cancel',
		confirmButtonText: 'Yes, delete it!',
	}).then(async (result) => {
		if (result.isConfirmed) {
			await articlesStore.removeDocument(id, documentRemoved);
			Swal.fire('Deleted!', 'Your document has been deleted.', 'success');
		}
	});
};

// get article by id with a onMounted
onMounted(async () => {
	await articlesStore.getArticleById(_id.value);
});
</script>

<style scoped>
.display {
	display: block;
}
.display-none {
	display: none;
}
</style>
