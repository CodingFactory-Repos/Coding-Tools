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
			<h1 class="text-4xl font-bold">{{ oneItems.title }}</h1>
		</div>
		<div class="flex flex-col md:flex-row items-center justify-between">
			<div class="w-full md:w-1/2">
				<span class="text-2xl font-bold text-gray-700 dark:text-white px-2">{{
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
