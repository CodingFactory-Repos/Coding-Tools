<template>
	<ModalOverlay v-if="showCommentModal" @close="closeCommentModal" size="2xl">
		<template #body>
			<AddComment />
		</template>
	</ModalOverlay>

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
			<div class="flex flew-row items-center justify-around">
				<button
					v-if="isParticipant()"
					@click="participationEvent(oneItems._id)"
					type="button"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					I already participate !
				</button>
				<button
					v-else
					type="button"
					@click="participationEvent(oneItems._id)"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					I want to participate !
				</button>
				<h1 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					{{ oneItems.title ? oneItems.title : 'Pas de titre spécifié' }}
				</h1>
				<button
					type="button"
					@click="openMetaModal"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					{{
						oneItems.participants?.length == 0 || oneItems.participants == undefined
							? 'No once participate'
							: oneItems.participants?.length == 1
							? `See the only participant`
							: `See the ${oneItems.participants?.length} participants`
					}}
				</button>
			</div>
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

			<div v-else class="flex justify-around items-center flex-row">
				<button
					type="button"
					@click="
						() => {
							$router.push('/app/blog');
						}
					"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					<svg
						fill="none"
						class="w-4 h-4 mr-2 -ml-1"
						stroke="white"
						stroke-width="1.5"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
						></path>
					</svg>
					All articles
				</button>
				<button
					type="button"
					@click="openCommentModal"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Write a comment
				</button>
				<button
					type="button"
					@click="changeComments"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					{{
						oneItems.comments?.length == 0 || oneItems.comments == undefined
							? 'No once comment'
							: oneItems.comments?.length == 1
							? `1 comment`
							: `${oneItems.comments?.length} comments`
					}}
				</button>
			</div>
		</div>
	</div>

	<div :class="showComments ? 'display' : 'display-none'">
		<!-- <div class="text-center">
			<h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">All Comments</h3>
		</div> -->
		<article v-for="comment in oneItems.comments" class="p-5">
			<div class="flex items-center mb-4 space-x-4">
				<img
					class="w-10 h-10 rounded-full"
					src="https://cdn.discordapp.com/attachments/930039778332786718/1088502450786402394/luffy.jpeg"
					alt=""
				/>
				<div class="space-y-1 font-medium dark:text-white">
					<p>{{ comment.firstName }} {{ comment.lastName }}</p>
				</div>
			</div>
			<footer class="mb-5 text-sm text-gray-500 dark:text-gray-400">
				<p>Write the {{ formatDate(comment.date) }}</p>
			</footer>
			<!-- {{ comment.date.split('T')[0].split('-').reverse().join('/') }} {{ comment.date.split('T')[1].split('.')[0] -->

			<p
				v-for="description in comment.descriptions"
				class="mb-2 font-light text-gray-500 dark:text-gray-400"
			>
				{{ description.value }}
			</p>
		</article>
	</div>
</template>

<style scoped>
.display {
	display: block;
}
.display-none {
	display: none;
}
</style>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import ModalOverlay from '@/components/common/Modal.vue';
import AddComment from '@/components/blog/AddComment.vue';
import Swal from 'sweetalert2';

// get store
const articleStore = useArticleStore();
const oneItems = computed(() => articleStore.oneItems);

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Display the modal
const showModal = ref(false);
const showComments = ref(false);
const showCommentModal = ref(false);

// Function to open and close the modal
const openMetaModal = () => (showModal.value = true);
const closeMetaModal = () => (showModal.value = false);
const openCommentModal = () => (showCommentModal.value = true);
const closeCommentModal = () => (showCommentModal.value = false);
const changeComments = () => (showComments.value = !showComments.value);

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

const formatDate = (date: Date) => {
	// transform date to string
	const newDate = date.toString();
	const dateSplited = newDate.split('T')[0].split('-').reverse().join('/');
	const timeSplited = newDate.split('T')[1].split('.')[0];
	return `${dateSplited} at ${timeSplited}`;
};

// get article by id on mounted
onMounted(() => {
	getArticleById(_id.value);
});
</script>
