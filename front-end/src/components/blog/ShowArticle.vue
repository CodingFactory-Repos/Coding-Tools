<!-- eslint-disable vue/no-v-html -->
<template>
	<ModalOverlay v-if="showCommentModal" @close="closeCommentModal" size="2xl">
		<template #body>
			<AddComment />
		</template>
	</ModalOverlay>

	<div class="text-center">
		<ModalOverlay v-if="showModal" @close="closeMetaModal" size="2xl">
			<template #header>
				<h2 class="text-lg font-medium text-gray-900 dark:text-white">
					Liste des participants ({{ oneItems.participants.length }})
				</h2>
			</template>
			<template #body>
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<caption class="hidden">
							Liste des participants
						</caption>
						<thead
							class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
						>
							<tr>
								<th scope="col" class="px-6 py-3">Email</th>
								<th scope="col" class="px-6 py-3">FirstName</th>
								<th scope="col" class="px-6 py-3">LastName</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="participant in oneItems.participants"
								:key="participant.email"
								class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
							>
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									{{ participant.email }}
								</th>
								<td class="px-6 py-4">
									{{ participant.firstName ? participant.firstName : 'Non indiqué' }}
								</td>
								<td class="px-6 py-4">
									{{ participant.lastName ? participant.lastName : 'Non indiqué' }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</template>
			<template #footer>
				<button
					v-if="isFinish()"
					type="button"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
				>
					Événement passé
				</button>
				<button
					v-else-if="isParticipant()"
					@click="participationEvent(oneItems._id)"
					type="button"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					Je participe déjà !
				</button>
				<button
					v-else
					type="button"
					@click="participationEvent(oneItems._id)"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Je veux participer !
				</button>
			</template>
		</ModalOverlay>
		<img
			class="cover h-72 w-screen object-cover object-center"
			:src="
				oneItems.picture && oneItems.picture != ''
					? oneItems.picture
					: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
			"
			alt=""
		/>
		<div class="text-center pt-4 relative">
			<h1 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
				{{ oneItems.title ? oneItems.title : 'Pas de titre spécifié' }}
			</h1>
			<div class="pt-3 pb-2">
				<span
					class="bg-blue-100 text-blue-800 text-l font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
				>
					{{ new Date(oneItems.date).toLocaleDateString('fr-FR') }}
				</span>
			</div>
		</div>

		<div class="pt-2 pb-5 pr-40 pl-40 text-left">
			<p class="markdown-preview text-gray-900 dark:text-white">
				{{ oneItems.descriptions ? oneItems.descriptions : 'Pas de description spécifiée' }}
			</p>
		</div>
		<div class="markdown-content pt-2 pb-5 pr-40 pl-40 text-left">
			<div v-html="renderMarkdown()" class="text-gray-900 dark:text-white"></div>
		</div>
		<div class="pt-5">
			<button
				v-if="oneItems.type !== 'Evenement'"
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
					/>
				</svg>
				Tous les articles
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
						/>
					</svg>
					Tous les articles
				</button>
				<button
					type="button"
					@click="openCommentModal"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					<Comment />
				</button>
				<button
					type="button"
					@click="openMetaModal"
					class="items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Participation
				</button>
			</div>
		</div>
	</div>

	<div>
		<article
			v-for="comment in oneItems.comments"
			:key="comment.title"
			class="m-2 p-3 bg-white rounded-lg dark:bg-gray-800 relative"
		>
			<header class="mb-2">
				<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
					{{ comment.title }}
				</h3>
			</header>
			<div class="flex items-center mb-4 space-x-2">
				<img
					class="w-10 h-10 rounded-full"
					:src="
						comment.picture
							? comment.picture
							: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
					"
					alt=""
				/>
				<!-- <UserCircle class="logo rounded-full text-gray-500" /> -->
				<div class="font-medium dark:text-white">
					<p class="text-gray-900 dark:text-white">
						{{ comment.firstName }} {{ comment.lastName }}
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">{{ comment.email }}</p>
				</div>
			</div>
			<footer class="mb-5 text-sm text-gray-500 dark:text-gray-400">
				<p>Écrit le {{ formatDate(comment.date) }}</p>
			</footer>

			<p class="mb-2 font-light text-gray-500 dark:text-gray-400">
				{{ comment.descriptions }}
			</p>

			<div v-if="oneItems.owner._id === user._id || user.role === 2" class="absolute top-2 right-2">
				<button
					type="button"
					@click="removeComment(oneItems._id, comment)"
					class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs p-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
				>
					<DeleteLogo />
				</button>
			</div>
		</article>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import ModalOverlay from '@/components/common/Modal.vue';
import AddComment from '@/components/blog/AddComment.vue';
import Swal from 'sweetalert2';
import MarkdownIt from 'markdown-it';
import Comment from '../common/svg/Comment.vue';
import MarkdownItClass from '@toycode/markdown-it-class';
// import UserCircle from '../common/svg/UserCircle.vue';
import DeleteLogo from '../common/svg/DeleteLogo.vue';

let markdown = ref('');

// create renderMarkdown method
const renderMarkdown = () => {
	const md = new MarkdownIt();

	md.use(MarkdownItClass, {
		h1: 'text-4xl mt-5 mb-2 border-b border-gray-300 font-bold text-gray-900 dark:text-white',
		h2: 'text-3xl mt-5 mb-2 border-b border-gray-300 font-bold text-gray-900 dark:text-white',
		h3: 'text-2xl mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h4: 'text-xl mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h5: 'text-lg mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h6: 'text-base mt-5 mb-2 font-bold text-gray-500 dark:text-white',
		img: 'max-w-[25rem] m-auto h-auto mt-7 mb-7',
		p: 'text-gray-900 mt-2 mb-2 dark:text-white',
	});

	return md.render(markdown.value);
};

// get store
const articleStore = useArticleStore();
const oneItems = computed(() => articleStore.oneItems);

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Display the modal
const showModal = ref(false);
const showCommentModal = ref(false);

// Function to open and close the modal
const openMetaModal = () => (showModal.value = true);
const closeMetaModal = () => (showModal.value = false);
const openCommentModal = () => (showCommentModal.value = true);
const closeCommentModal = () => (showCommentModal.value = false);

// get id from url
const _id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});

// get article by id
const getArticleById = async (_id: string) => {
	await articleStore.getArticleById(_id);
	markdown.value = oneItems.value.content;
};

const formatDate = (date: Date) => {
	// transform date to string
	const newDate = date.toString();
	const dateSplited = newDate.split('T')[0].split('-').reverse().join('/');
	const timeSplited = newDate.split('T')[1].split('.')[0];
	return `${dateSplited} à ${timeSplited}`;
};

// get article by id on mounted
onMounted(() => {
	getArticleById(_id.value);
	markdown.value = oneItems.value.descriptions;
});

// function to throw a sweet alert to confirm the participation or to unsubscribe from the event
const participationEvent = (id) => {
	const isParticipant = oneItems.value.participants?.some(
		(participant) => participant.email === user.value.profile.email,
	);

	const participant = {
		firstName: user.value.profile.firstName,
		lastName: user.value.profile.lastName,
		email: user.value.profile.email,
		_id: user.value._id,
	};

	if (isParticipant) {
		Swal.fire({
			title: 'Do you want to unsubscribe from the event ?',
			text: 'You can always re-register after',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, i want !',
		}).then((result) => {
			if (result.isConfirmed) {
				articleStore.removeParticipant(id, participant);
			}
		});
	} else {
		Swal.fire({
			title: 'Are you sure you want to participate in this event ?',
			text: 'You can always unsubscribe after',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, i want !',
		}).then((result) => {
			if (result.isConfirmed) {
				authStore.getCurrentUser();

				// @ts-ignore
				if (oneItems.value.participants?.includes(participant)) {
					return;
				}

				articleStore.addParticipant(id, participant);
			}
		});
	}
};

// function to check if user is participant
const isParticipant = () => {
	return oneItems.value.participants?.some(
		(participant) => participant.email === user.value.profile.email,
	);
};

const isFinish = () => {
	const date = new Date(oneItems.value.date);
	const now = new Date();
	return date < now;
};

// function to delete an article
const removeComment = (articleId, comment) => {
	const removedComment = {
		_id: comment._id,
		title: comment.title,
		descriptions: comment.descriptions,
		date: comment.date,
		email: comment.email,
		firstName: comment.firstName,
		lastName: comment.lastName,
		picture: comment.picture,
	};

	Swal.fire({
		title: 'Are you sure you want to delete this article ?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!',
	}).then((result) => {
		if (result.isConfirmed) {
			articleStore.removeComment(articleId, removedComment);
			Swal.fire('Deleted!', 'Your article has been deleted.', 'success');
		}
	});
};
</script>

<style scoped>
.display {
	display: block;
}
.display-none {
	display: none;
}

.logo {
	width: 3rem !important;
	height: auto !important;
}
</style>
