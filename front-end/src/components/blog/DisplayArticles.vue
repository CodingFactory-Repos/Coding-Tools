<template>
	<div class="text-center">
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold">Blog</h1>
			<button
				type="submit"
				@click="openMetaModal"
				class="font-bold rounded-lg text-sm px-4 mt-4 py-2 focus:outline-none gap-2 bg-blue-700"
			>
				<span class="text-white">Create article</span>
			</button>
		</div>

		<ModalOverlay v-if="showModal" @close="closeMetaModal" size="3xl">
			<template #body>
				<AddArticles />
			</template>
		</ModalOverlay>

		<div class="text-center max-w-full h-full">
			<h2 class="text-3xl font-bold pt-5">All Articles</h2>

			<!-- <div class="w-full pl-32 pr-32">
				<ul
					class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				>
					<li
						v-for="type in types"
						class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
					>
						<div class="flex items-center pl-3">
							<input
								id="vue-checkbox-list"
								type="checkbox"
								:value="type.value"
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
							/>
							<label
								for="vue-checkbox-list"
								class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>{{ type.value }}</label
							>
						</div>
					</li>
				</ul>
			</div> -->

			<div class="flex items-center justify-center p-5">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div
						v-for="item in items"
						class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
					>
						<CardArticle :item="item" />
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

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import AddArticles from './AddArticles.vue';
import ModalOverlay from '@/components/common/Modal.vue';
import CardArticle from './CardArticle.vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';

// Use the article store
const articleStore = useArticleStore();
const authStore = useAuthStore();

// Create a reactive variable to store the articles
const items = computed(() => articleStore.items);
const user = computed(() => authStore.user);

// Display the modal
const showModal = ref(false);

// Get the router
const router = useRouter();

const types = ref([
	{
		value: 'Infos',
	},
	{
		value: 'Evenement',
	},
	{
		value: 'Tuto',
	},
]);

// Function to open and close the modal
const openMetaModal = () => (showModal.value = true);
const closeMetaModal = () => (showModal.value = false);

// Fetch the articles
const getArticles = async () => {
	await articleStore.getArticle();
};

const getArticleById = async (id: string) => {
	await articleStore.getArticleById(id);
};

// Call the getArticles method when the component is created
onMounted(() => {
	getArticles();
	// getArticleById(user.value.events);
});

// Function to open the article
const openArticle = (id: string) => {
	console.log(items);
	console.log(id);
	router.push(`/app/blog/${id}`);
};
</script>
