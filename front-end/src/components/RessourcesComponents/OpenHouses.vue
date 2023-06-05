<!-- eslint-disable vue/require-v-for-key -->
<template>
	<div>
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold">Journée Porte Ouverte</h1>
			<FormOpenHouse />
		</div>
		<div class="text-center flex items-center justify-center max-w-full h-full">
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
				<div
					v-for="item in items"
					class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
				>
					<CardOpenHouse :item="item" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOpenHouseStore } from '@/store/modules/openHouse.store';
import FormOpenHouse from './FormOpenHouses.vue';
import CardOpenHouse from './CardOpenHouse.vue';

// Use the openHouses store
const openHousesStore = useOpenHouseStore();

// fetch the openHouses
const getOpenHouse = async () => {
	await openHousesStore.getOpenHouse();
};
// Display the modal
const showModal = ref(false);

// Get the router
const router = useRouter();

// Create a reactive variable to store the articles && sort them by date
const items = computed(() => {
	// eslint-disable-next-line vue/no-side-effects-in-computed-properties
	return openHousesStore.items.sort((a, b) => {
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});
});

// Call the getArticles method when the component is created
onMounted(() => {
	getOpenHouse();
});
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
