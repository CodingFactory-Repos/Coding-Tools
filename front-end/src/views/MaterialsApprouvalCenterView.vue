<template>
	<div class="cards">
		<div v-for="res in reservation" :key="res._id" class="p-0.5">
			<div
				class="flex px-4 py-3 max-w-[400px] min-h-[170px] dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 rounded-lg dark:border-none hover:bg-gray-200"
			>
				<div class="divide-y divide-gray-100 dark:divide-gray-700">
					<a class="flex px-4 py-3">
						<div class="flex-shrink-0">
							<img class="rounded-full w-11 h-11" :src="res.picture" :alt="res.name" />
							<div
								class="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800"
							>
								<svg
									class="w-3 h-3 text-white"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"
									/>
									<path
										d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
									/>
								</svg>
							</div>
						</div>
						<div class="w-full pl-3">
							<div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
								Nouvelle demande d'emprunt de matériel de
								<span class="font-semibold text-gray-900 dark:text-white">
									{{
										users.filter((user) => user._id === res.borrowingHistory.borrowingUser)[0]
											?.profile.firstName +
										' ' +
										users.filter((user) => user._id === res.borrowingHistory.borrowingUser)[0]
											?.profile.lastName
									}} </span
								>: {{ res.name }}
								<span>
									Du :
									<span class="font-semibold text-gray-900 dark:text-white">
										{{ new Date(res.borrowingHistory.borrowingDate).toLocaleDateString() }}
									</span>
									jusqu'au :
									<span class="font-semibold text-gray-900 dark:text-white">
										{{ new Date(res.borrowingHistory.returnDate).toLocaleDateString() }}
									</span>
								</span>
							</div>
							<button
								type="button"
								class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
								@click="declineReservation(res._id, res.borrowingHistory.borrowingID)"
							>
								Refuser
							</button>
							<button
								type="button"
								class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
								@click="acceptReservation(res._id, res.borrowingHistory.borrowingID)"
							>
								Accepter
							</button>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useMaterialStore } from '@/store/modules/material.store';
import Swal from 'sweetalert2';


const materialStore = useMaterialStore();
const reservation = computed(() => materialStore.pendingMaterials);
const users = ref([]);

onMounted(() => {
	materialStore.getPendingMaterials().then(() => {
		reservation.value.forEach((res1) => {
			materialStore.getUserById(res1.borrowingHistory.borrowingUser).then((res) => {
				users.value.push(res);
			});
		});
	});
});
function acceptReservation(materialID: string, borrowingID: string) {
	const payload = {
		borrowingID: borrowingID,
	};
	materialStore.acceptBorrowing(materialID, payload);
	Swal.fire({
		title: 'Emprunt accepté',
		icon: 'success',
		showConfirmButton: false,
		timer: 1500,
	})
}

function declineReservation(materialID: string, borrowID: string) {
	const payload = {
		borrowingID: borrowID,
	};
	materialStore.declineBorrowing(materialID, payload);
	Swal.fire({
		title: 'Emprunt refusé',
		icon: 'success',
		showConfirmButton: false,
		timer: 1500,
	})
}

onBeforeUnmount(() => {
	users.value = [];
});
</script>
<style scoped>
.cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: left;
}
</style>
