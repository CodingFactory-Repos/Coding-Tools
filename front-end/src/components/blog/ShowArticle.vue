<template>
	<div>
		<ModalOverlay v-if="showModal" @close="closeMetaModal" size="xl">
			<template #header>
				<h2 class="text-lg font-medium text-gray-900 dark:text-white">List of participants</h2>
			</template>
			<template #body>
				<div v-for="participant in oneItems.participants">
					{{ participant.email }}
				</div>
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
					></path>
				</svg>
				All articles
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
		</div>
	</div>
</template>

<style scoped></style>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import ModalOverlay from '@/components/common/Modal.vue';
import Swal from 'sweetalert2';

// get store
const articleStore = useArticleStore();
const oneItems = computed(() => articleStore.oneItems);

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Display the modal
const showModal = ref(false);

// Function to open and close the modal
const openMetaModal = () => (showModal.value = true);
const closeMetaModal = () => (showModal.value = false);

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

// function to throw a sweet alert to confirm the participation or to unsubscribe from the event
const participationEvent = (id) => {
	const isParticipant = oneItems.value.participants?.some(
		(participant) => participant.email === user.value.profile.email,
	);

	if (isParticipant) {
		Swal.fire({
			title: 'Do you want to unsubscribe from the event ?',
			text: 'You can always re-register after',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, i want !',
		}).then((result) => {
			if (result.isConfirmed) {
				articleStore.removeParticipant(id, user.value.profile);
				window.location.reload();
			}
		});
	} else {
		Swal.fire({
			title: 'Are you sure you want to participate in this event ?',
			text: 'You can always unsubscribe after',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, i want !',
		}).then((result) => {
			if (result.isConfirmed) {
				authStore.getCurrentUser();

				// @ts-ignore
				if (oneItems.value.participants?.includes(user.value.profile)) {
					return;
				}

				articleStore.addParticipant(id, user.value.profile);

				window.location.reload();
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
</script>
