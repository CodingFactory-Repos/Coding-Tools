<!-- eslint-disable vue/require-v-for-key -->
<template>
	<div>
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold text-black dark:text-white">Journée Porte Ouverte</h1>
		</div>
		<div class="text-center flex items-center justify-center max-w-full h-full">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div
					v-for="item in filteredItems"
					class="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
				>
					<div
						class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
					>
						<a href="#">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								JPO du {{ new Date(item.date).toLocaleDateString('fr-FR') }}
							</h5>
						</a>
						<button
							@click="openJPO(item._id)"
							class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Voir les documents
							<svg
								aria-hidden="true"
								class="w-4 h-4 ml-2 -mr-1"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useRouter } from 'vue-router';

const articlesStore = useArticleStore();
const router = useRouter();

// Use the articles store
const articles = computed(() => articlesStore.items);

// filter the articles if they have JPO tag
const filteredItems = computed(() => {
	return articles.value.filter((item) => item.tags.toUpperCase().includes('JPO'));
});

const openJPO = (id) => {
	router.push(`/app/ressource/openhouse/${id}`);
};

// Call articlesStore.getArticles() when the component is created
onMounted(async () => {
	await articlesStore.getArticle();
});
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
