<template>
	<div>
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold">{{ oneItems.title }}</h1>
		</div>
		<img
			class="cover h-72 w-screen object-cover object-center"
			:src="
				oneItems.picture && oneItems.picture != ''
					? oneItems.picture
					: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
			"
			alt=""
		/>
		<div class="pt-3 pb-2">
			<span
				class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
				>{{ oneItems.description }}</span
			>
		</div>
		<button
			type="button"
			@click="
				() => {
					$router.push('/app/ressource');
				}
			"
		>
			Retour
		</button>
	</div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useOpenHouseStore } from '@/store/modules/openHouse.store';

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
