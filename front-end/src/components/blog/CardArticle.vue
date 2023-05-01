<template>
	<img
		class="object-cover h-48 w-96 rounded-t-lg"
		:src="
			item.picture && item.picture != ''
				? item.picture
				: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
		"
		alt=""
	/>
	<div class="pt-3 pb-2">
		<span
			class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
			>{{ item.type }}</span
		>
	</div>
	<div class="pt-2 pb-5">
		<a href="#">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{{ item.title ? item.title : 'Pas de titre spécifié' }}
			</h5>
		</a>
		<p class="mb-3 p-3 font-normal text-gray-700 dark:text-gray-400">
			{{
				item.descriptions[0].value.length > 100
					? item.descriptions[0].value.substring(0, 100) + '...'
					: item.descriptions[0].value
			}}
		</p>
		<button
			type="button"
			@click="openArticle(item._id)"
			class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Read more
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
				/>
			</svg>
		</button>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useRouter } from 'vue-router';

defineProps<{
	item: any;
}>();

// get store
const articleStore = useArticleStore();

const router = useRouter();

// Fetch the articles
const getArticles = async () => {
	await articleStore.getArticle();
};

// Call the getArticles method when the component is created
onMounted(() => {
	getArticles();
});

// function to check if user is participant
const openArticle = (id: string) => {
	router.push(`/app/blog/${id}`);
};
</script>

<style scoped>
.display {
	display: block;
}
.display-none {
	display: none;
}
</style>
