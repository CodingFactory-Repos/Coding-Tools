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
		<div class="text-center p-4">
			<h1 class="text-4xl font-bold">{{ oneItems.title }}</h1>
		</div>
		<div class="flex flex-col md:flex-row items-center justify-between">
			<div class="w-full md:w-1/2">
				<span class="text-2xl font-bold text-gray-700 dark:text-white p-8">{{
					oneItems.description
				}}</span>
			</div>

			<img
				class="w-1/2 md:w-2/5 h-auto object-cover object-center"
				:src="
					oneItems.picture && oneItems.picture != ''
						? oneItems.picture
						: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
				"
				alt=""
			/>
		</div>
		<div class="flex items-center mb-4">
			<img class="md:w-2/5 h-auto object-cover object-center" :src="oneItems.picture" alt="Photo" />
			<div>
				<h3 class="text-lg font-semibold">{{ formatAddress(oneItems.address) }}</h3>
				<p class="text-gray-600">{{ oneItems.description }}</p>
			</div>
		</div>
		<div class="mt-8">
			<h2 class="text-2xl font-bold mb-4">Participants</h2>
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Name
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Email
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="participant in oneItems.participants" :key="participant.id">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900">{{ participant.name }}</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{{ participant.email }}</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<div class="w-full flex justify-center items-center">
		<button
			type="button"
			class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Participer
		</button>
	</div>
	<div class="flex flex-col items-center space-y-4">
		<!-- Lien vers le premier PDF -->
		<a :href="pdf1" download class="text-blue-700 hover:text-blue-800"> Télécharger le PDF 1 </a>

		<!-- Lien vers le deuxième PDF -->
		<a :href="pdf2" download class="text-blue-700 hover:text-blue-800"> Télécharger le PDF 2 </a>
	</div>
	<div class="w-full flex justify-center items-center">
		<button
			type="button"
			@click="openOpenHouses()"
			class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Retour
		</button>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOpenHouseStore } from '@/store/modules/openHouse.store';

// get router
const router = useRouter();

// Function to return to the openHouse page
const openOpenHouses = () => {
	router.push(`/app/ressource/openhouse`);
};

// get store
const openHouses = useOpenHouseStore();
const oneItems = computed(() => openHouses.oneItems);

// get id from url
const _id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});

const formatAddress = (address) => {
	return `${address.street}, ${address.zipCode}, ${address.city}`;
};

// get openHouse by id
const getOpenHouseById = async (_id: string) => {
	await openHouses.getOpenHouseById(_id);
};

// fetch openHouse data on mounted
onMounted(() => {
	getOpenHouseById(_id.value);
});
</script>
<style scoped>
.display {
	display: block;
}
.display-none {
	display: none;
}
</style>
