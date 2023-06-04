<!-- eslint-disable vue/require-v-for-key -->
<template>
	<div>
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold">Journée Porte Ouverte</h1>
		</div>
		<div class="text-center flex items-center justify-center max-w-full h-full">
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
				<div
					v-for="item in items"
					class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
				>
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
							>{{ formatDate(item.date) }}</span
						>
					</div>
					<div class="pt-2 pb-5">
						<a href="#">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{{ item.title ? item.title : 'Pas de titre spécifié' }}
							</h5>
						</a>
						<p class="mb-3 p-3 font-normal text-gray-700 dark:text-gray-400">
							{{ item.description ? item.description : 'Pas de description spécifiée' }}
						</p>
						<button
							type="button"
							@click="openOpenHouse(item._id)"
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
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOpenHouseStore } from '@/store/modules/openHouse.store';

// Use the openHouses store
const openHousesStore = useOpenHouseStore();
// Create a reactive variable to store the articles
const items = computed(() => openHousesStore.items);

// Display the modal
const showModal = ref(false);

// Get the router
const router = useRouter();

// Fetch the articles
const getOpenHouse = async () => {
	await openHousesStore.getOpenHouse();
};

// Call the getArticles method when the component is created
onMounted(() => {
	getOpenHouse();
});

// Function to open the openHouse page
const openOpenHouse = (id: string) => {
	router.push(`/app/ressource/openhouse/${id}`);
};

// Function to format the date
const formatDate = (date) => {
	const options = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	} as Intl.DateTimeFormatOptions;
	return new Date(date).toLocaleDateString('fr-FR', options);
};
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
