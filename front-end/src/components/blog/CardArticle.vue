<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="boxShadow w-96">
		<img
			class="object-cover h-48 w-full rounded-t-lg"
			:src="
				item.picture && item.picture != ''
					? item.picture
					: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
			"
			alt=""
		/>
		<div v-if="item.owner._id === user._id || user.role === 2" class="absolute top-2 left-2">
			<button
				type="button"
				@click="deleteArticle(item._id)"
				class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs p-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
			>
				<DeleteLogo />
			</button>
		</div>
		<div v-if="item.owner._id === user._id || user.role === 2" class="absolute top-2 right-2">
			<button
				type="button"
				@click="editArticle(item._id)"
				class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-xs p-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
			>
				<Edit class="!fill-light-primary" />
			</button>
		</div>
		<div class="pt-3 pb-2" v-if="item.type == 'Tuto' && (user.role == 2 || user.role == 3)">
			<div
				v-if="item.status != 'Accepted'"
				class="flex flex-row items-center justify-evenly space-x-2"
			>
				<button
					@click="updateStatus(item._id, 'Accepted')"
					class="text-green-700 border border-green-700 focus:ring-4 focus:outline-none font-small rounded-lg text-2xs p-1 text-center inline-flex items-center dark:text-green-500"
				>
					<Validate />
				</button>

				<span
					class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
				>
					En attente
				</span>

				<button
					@click="deleteArticle(item._id)"
					class="text-red-700 border border-red-700 focus:ring-4 focus:outline-none font-small rounded-lg text-2xs p-1 text-center inline-flex items-center dark:text-red-500"
				>
					<Cross class="!fill-red-700" />
				</button>
			</div>
			<div v-else class="flex flex-row items-center justify-evenly space-x-2">
				<span
					v-if="item.status == 'Accepted'"
					class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
				>
					Accepté
				</span>
				<button
					@click="updateStatus(item._id, 'Pending')"
					class="text-yellow-400 border border-yellow-400 focus:ring-4 focus:outline-none font-small rounded-lg text-2xs p-1 text-center inline-flex items-center dark:text-yellow-500"
				>
					<Pause class="!fill-yellow-400" />
				</button>
			</div>
		</div>
		<div class="pt-3.5 pb-3.5" v-else>
			<span
				class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
			>
				{{ new Date(item.date).toLocaleDateString('fr-FR') }}
			</span>
		</div>
		<div class="pt-2 pb-5">
			<a href="#">
				<h5
					:class="item.title.length > 40 && 'text-xl'"
					class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
				>
					{{ item.title ? item.title : 'Pas de titre spécifié' }}
				</h5>
			</a>
			<p
				:class="item.descriptions.length > 60 && 'text-md'"
				class="min-h-[5rem] flex flex-col justify-center items-center justify-center font-normal text-gray-700 dark:text-gray-400"
			>
				{{ item.descriptions ? item.descriptions : 'Pas de description spécifiée' }}
			</p>
		</div>
		<div class="pt-2 pb-5 flex flex-row justify-evenly items-center">
			<button
				type="button"
				@click="addLike(item._id)"
				class="text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs p-2 text-center inline-flex items-center mr-2 dark:text-blue-500"
			>
				<div v-if="item.likes" class="flex flex-row justify-center items-center">
					<div v-if="isLiked">
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
				class="text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs p-2 text-center inline-flex items-center mr-2 dark:text-blue-500"
			>
				<div v-if="item.dislikes" class="flex flex-row justify-center items-center">
					<div v-if="isDisliked">
						<SolidDislike />
					</div>
					<div v-else>
						<OutlineDislike />
					</div>

					<span v-if="item.dislikes.length > 0" class="ml-2">{{ item.dislikes.length }}</span>
				</div>
				<div v-else>
					<OutlineDislike />
				</div>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import OutlineLike from '@/components/common/svg/OutlineLike.vue';
import SolidLike from '@/components/common/svg/SolidLike.vue';
import OutlineDislike from '@/components/common/svg/OutlineDislike.vue';
import SolidDislike from '@/components/common/svg/SolidDislike.vue';
import DeleteLogo from '@/components/common/svg/DeleteLogo.vue';
import Edit from '@/components/common/svg/Edit.vue';
import Validate from '@/components/common/svg/Validate.vue';
import Cross from '@/components/common/svg/Cross.vue';
import Pause from '@/components/common/svg/Pause.vue';

const props = defineProps<{
	item: any;
}>();

// get store
const articleStore = useArticleStore();

const authStore = useAuthStore();
const user = authStore.user;

const router = useRouter();

const isLiked = computed(() => {
	return props.item.likes.some((like) => like.id === user._id);
});

const isDisliked = computed(() => {
	return props.item.dislikes.some((dislike) => dislike.id === user._id);
});

// Function to fetch all articles
const getArticles = async () => {
	await articleStore.getArticle();
};

// Function to delete an article
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
		}
	});
};

// locate user id in likes array
const userId = {
	id: user._id,
};

// Function to add a like to an article and update the store
const addLike = async (id: string) => {
	if (isLiked.value) {
		await articleStore.removeLike(id, userId);
	} else {
		await articleStore.addLike(id, userId);
		await articleStore.removeDislike(id, userId);
	}
};

const addDislike = async (id: string) => {
	if (isDisliked.value) {
		await articleStore.removeDislike(id, userId);
	} else {
		await articleStore.addDislike(id, userId);
		await articleStore.removeLike(id, userId);
	}
};

// Function to update the status of an article
const updateStatus = async (id, status) => {
	Swal.fire({
		title: 'Validez votre choix',
		icon: 'info',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Oui',
		cancelButtonText: 'Non',
	}).then(async (result) => {
		if (result.isConfirmed) {
			// get article
			const oneItems = computed(() => articleStore.oneItems);
			await articleStore.getArticleById(id);
			const articleToEdit = ref(oneItems.value);

			// edit fields
			delete articleToEdit.value._id;

			if (status == 'Pending') {
				articleToEdit.value.status = 'Pending';
			} else {
				articleToEdit.value.status = 'Accepted';
			}

			// post the data
			await articleStore.updateArticle(id, articleToEdit.value);

			// update page articles
			await getArticles();
		}
	});
};

// Function to open the edit page
const editArticle = async (id: string) => {
	router.push(`/app/blog/edit/${id}`);
};

// function to open an article
const openArticle = (id: string) => {
	router.push(`/app/blog/${id}`);
};

// Function to open a tutorial
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
		background-color: #94e185;
		border-color: #78d965;
		box-shadow: 0px 0px 4px 1px #94e185;
	}

	&.in-progress:before {
		background-color: #ffc182;
		border-color: #ffb161;
		box-shadow: 0px 0px 4px 1px #ffc182;
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
