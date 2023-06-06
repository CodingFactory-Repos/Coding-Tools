<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="boxShadow">
		<img
			class="object-cover h-48 w-96 rounded-t-lg"
			:src="
				item.picture && item.picture != ''
					? item.picture
					: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
			"
			alt=""
		/>
		<div v-if="item.owner === user._id || user.role === 2" class="absolute top-2 left-2">
			<button
				type="button"
				@click="deleteArticle(item._id)"
				class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs p-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
			>
				<DeleteLogo />
			</button>
		</div>
		<div v-if="item.owner === user._id || user.role === 2" class="absolute top-2 right-2">
			<button
				type="button"
				@click="editArticle(item._id)"
				class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-xs p-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
			>
				<Edit class="!fill-light-primary" />
			</button>
		</div>
		<div class="pt-3 pb-2">
			<span
				class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
				>{{ item.type }}
			</span>
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
				Lire l'article
			</button>
			<button
				v-else
				type="button"
				@click="openTutorial(item._id)"
				class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Lire le tutoriel
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
		<!-- Validation -->
		<div v-if="item.type == 'Tuto'" class="flex flex-row place-content-evenly mb-3 items-center text-dark-primary dark:text-light-primary">
			<div
				class=""
				:class="item.status == 'Accepted' ? 'status open' : 'status in-progress'"
			>
				{{ item.status == 'Accepted' ? 'Accepted' : 'Pending' }}
			</div>
			<div class="flex flex-col space-y-2">
				<button class="border-solid border rounded-lg px-2 border-green-400 py-1">
					Accepter
				</button>
				<button class="border-solid border rounded-lg p-1 border-red-500">
					Refuser
				</button>
			</div>
			
		</div>
	</div>
	
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';
import MarkdownIt from 'markdown-it';
import Swal from 'sweetalert2';

import OutlineLike from '@/components/common/svg/OutlineLike.vue';
import SolidLike from '@/components/common/svg/SolidLike.vue';
import OutlineDislike from '@/components/common/svg/OutlineDislike.vue';
import SolidDislike from '@/components/common/svg/SolidDislike.vue';
import DeleteLogo from '@/components/common/svg/DeleteLogo.vue';
import Edit from '@/components/common/svg/Edit.vue';

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
const user = authStore.user;

const router = useRouter();

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

	if (hasUserLiked.value) {
		await articleStore.removeLike(id, like);
	} else {
		await articleStore.addLike(id, like);
		await articleStore.removeDislike(id, like);
	}
};

const addDislike = async (id: string) => {
	const dislike = {
		id: user._id,
	};

	if (hasUserDisliked.value) {
		await articleStore.removeDislike(id, dislike);
	} else {
		await articleStore.addDislike(id, dislike);
		await articleStore.removeLike(id, dislike);
	}
};

const deleteArticle = async (id: string) => {
	Swal.fire({
		title: 'Are you sure to delete this article ?',
		icon: 'info',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No',
	}).then(async (result) => {
		if (result.isConfirmed) {
			await articleStore.deleteArticle(id);
			window.location.reload();
		}
	});
};

const editArticle = async (id: string) => {
	router.push(`/app/blog/edit/${id}`);
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

<style scoped lang="scss">
.display {
	display: block;
}
.display-none {
	display: none;
}

.status {
	&.open:before {
		background-color: #94E185;
		border-color: #78D965;
		box-shadow: 0px 0px 4px 1px #94E185;
	}

	&.in-progress:before {
		background-color: #FFC182;
		border-color: #FFB161;
		box-shadow: 0px 0px 4px 1px #FFC182;
	}

	&:before {
		content: ' ';
		display: inline-block;
		width: 7px;
		height: 7px;
		margin-right: 10px;
		border: 1px solid #000;
		border-radius: 7px;
	}
}

</style>
