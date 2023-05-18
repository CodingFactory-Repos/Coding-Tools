<template>
	<div class="text-center">
		<div class="text-center pt-4">
			<h1 class="text-4xl mb-2 font-bold tracking-tight text-gray-900 dark:text-white">Blog</h1>
			<button
				type="submit"
				@click="redirectNewArticle"
				class="font-bold rounded-lg text-sm px-4 mt-4 py-2 focus:outline-none gap-2 bg-blue-700"
			>
				<span class="text-white">Create article</span>
			</button>
		</div>

		<div class="text-center max-w-full h-full">
			<h2 class="text-3xl font-bold pt-5 text-gray-900 dark:text-white">All Articles</h2>

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
						:key="item._id"
						class="max-w-sm flex flex-col justify-between items-center relative bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
					>
						<CardArticle :item="item" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import CardArticle from './CardArticle.vue';
import { useArticleStore } from '@/store/modules/article.store';

import { useRouter } from 'vue-router';
const router = useRouter();

// Use the article store
const articleStore = useArticleStore();

// Create a reactive variable to store the articles && sort them by date
const items = computed(() => {
	// eslint-disable-next-line vue/no-side-effects-in-computed-properties
	return articleStore.items.sort((a, b) => {
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});
});

const redirectNewArticle = () => {
	router.push('/app/blog/new');
};

// Fetch the articles
const getArticles = async () => {
	await articleStore.getArticle();
};

// Call the getArticles method when the component is created
onMounted(() => {
	getArticles();
});
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
