<template>
	<div>
		<img
			class="cover h-72 w-screen object-cover object-center"
			:src="
				oneItems.picture && oneItems.picture != ''
					? oneItems.picture
					: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
			"
			alt=""
		/>
		<div class="text-center pt-4">
			<h1 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
				{{ oneItems.title ? oneItems.title : 'Pas de titre spécifié' }}
			</h1>
			<div class="pt-3 pb-2">
				<span
					class="bg-blue-100 text-blue-800 text-l font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
					>{{ oneItems.type }}</span
				>
			</div>
		</div>

		<div class="pt-2 pb-5 text-center">
			<div v-for="(description, index) in oneItems.descriptions">
				<img
					v-if="description.type == 'image'"
					:src="description.value"
					:alt="oneItems.title + ' ' + index"
					class="h-auto max-w-lg mx-auto"
				/>
				<p v-else class="mb-3 p-3 font-normal text-gray-700 dark:text-gray-400">
					{{ description.value }}
				</p>
			</div>
			<button
				type="button"
				@click="
					() => {
						$router.push('/app/blog');
					}
				"
				class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				All articles
				<svg
					aria-hidden="true"
					class="w-4 h-4 ml-2 -mr-1"
					fill="white"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
						clip-rule="evenodd"
					></path>
				</svg>
			</button>
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
import { useArticleStore } from '@/store/modules/article.store';

// get store
const articleStore = useArticleStore();
const oneItems = computed(() => articleStore.oneItems);

// get id from url
const _id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});

// get article by id
const getArticleById = async (_id: string) => {
	await articleStore.getArticleById(_id);
};

// get article by id on mounted
onMounted(() => {
	getArticleById(_id.value);
});
</script>
