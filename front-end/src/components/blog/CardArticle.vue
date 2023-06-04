<!-- eslint-disable vue/no-v-html -->
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
		<p
			v-html="renderMarkdown()"
			class="min-h-[5rem] flex flex-col justify-center items-center justify-center font-normal text-gray-700 dark:text-gray-400"
		></p>
	</div>
	<div class="pt-2 pb-5 flex flex-row justify-center items-center">
		<button
			type="button"
			@click="addLike(item._id)"
			class="text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs p-2 text-center inline-flex items-center mr-2 dark:text-blue-500"
		>
			<div v-if="item.likes" class="flex flex-row justify-center items-center">
				<div v-if="hasUserLiked">
					<SolidLike />
				</div>
				<div v-else>
					<OutlineLike />
				</div>

				<span v-if="item.likes.length > 0" class="ml-2">{{ item.likes.length }}</span>
			</div>
			<div v-else>
				<OutlineLike />
			</div>
		</button>
		<button 
			v-if="item.type != 'Tuto'"
			type="button"
			@click="openArticle(item._id)"
			class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Read article
		</button>
		<button 
			v-else
			type="button"
			@click="openTutorial(item._id)"
			class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Read tutorial 
		</button>
		<button
			type="button"
			@click="addDislike(item._id)"
			class="text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs p-2 text-center inline-flex items-center ml-2 dark:text-blue-500"
		>
			<div v-if="item.dislikes" class="flex flex-row justify-center items-center">
				<span v-if="item.dislikes.length > 0" class="mr-2">{{ item.dislikes.length }}</span>

				<div v-if="hasUserDisliked">
					<SolidDislike />
				</div>
				<div v-else>
					<OutlineDislike />
				</div>
			</div>
			<div v-else>
				<OutlineDislike />
			</div>
		</button>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';
import MarkdownIt from 'markdown-it';
import OutlineLike from '@/components/common/svg/OutlineLike.vue';
import SolidLike from '@/components/common/svg/SolidLike.vue';
import OutlineDislike from '@/components/common/svg/OutlineDislike.vue';
import SolidDislike from '@/components/common/svg/SolidDislike.vue';

const props = defineProps<{
	item: any;
}>();

let markdown = ref('');

// create renderMarkdown method
const renderMarkdown = () => {
	const md = new MarkdownIt();
	return md.render(markdown.value);
};

// get store
const articleStore = useArticleStore();
const authStore = useAuthStore();
const router = useRouter();

const user = authStore.user;

// Fetch the articles
const getArticles = async () => {
	await articleStore.getArticle();
	if (props.item.descriptions.length > 60) {
		markdown.value = props.item.descriptions.substring(0, 60);
		markdown.value += '...';
	} else {
		markdown.value = props.item.descriptions;
	}
};

const addLike = async (id: string) => {
	const like = {
		id: user._id,
	};

	await articleStore.addLike(id, like);
	await articleStore.removeDislike(id, like);

	window.location.reload();
};

const addDislike = async (id: string) => {
	const dislike = {
		id: user._id,
	};

	await articleStore.addDislike(id, dislike);
	await articleStore.removeLike(id, dislike);

	window.location.reload();
};

// Check if the user has liked the item
const hasUserLiked = computed(() => {
	return props.item.likes.some((like) => like.id === user._id);
});

const hasUserDisliked = computed(() => {
	return props.item.dislikes.some((dislike) => dislike.id === user._id);
});

// Call the getArticles method when the component is created
onMounted(() => {
	getArticles();
});

// function to check if user is participant
const openArticle = (id: string) => {
	router.push(`/app/blog/${id}`);
};

const openTutorial = (id: string) => {
	router.push(`/app/blog/tutorial/${id}`);
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
