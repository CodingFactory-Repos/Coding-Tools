<template>
	<div class="py-8">
		<h2 class="text-2xl font-bold mb-4">Open Houses</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<div
				v-for="openHouse in openHouses"
				:key="openHouse.id"
				class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<img :src="openHouse.picture" alt="" class="rounded-t-lg" />

				<div class="p-4">
					<h3 class="text-lg font-bold mb-2">{{ openHouse.title }}</h3>
					<p class="mb-2">
						<span class="font-bold">Date :</span> {{ formattedDate(openHouse.date) }}
					</p>
					<p class="mb-2">
						<span class="font-bold">Addresse :</span> {{ formattedAddress(openHouse.address) }}
					</p>
				</div>
				<div style="display: flex; justify-content: center; align-items: center">
					<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded">
						See more
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { Status } from '@/store/interfaces/axios.interface';
import { withErrorHandler } from '@/utils/storeHandler'; // storeHandler c'est pas ouf comme nom en vrai.

interface objNameA {
	propA: string;
	propB: boolean;
}

interface objNameB {
	something: objNameA;
}

export default {
	methods: {
		myMethod: withErrorHandler(async function () {
			const res = await http.get<Status<objNameB>>('/openHouses');
			const data = res.data;
			data.status; // typé
			data.something; // typé
			data.something.propA; // typé
			data.something.propB; // typé
		}),
	},
};
</script>
