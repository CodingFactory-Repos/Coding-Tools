<template>
	<div
		id="dropdownNotification"
		class="z-20 absolute w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700"
		aria-labelledby="dropdownNotificationButton"
	>
		<div
			class="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
		>
			Demandes d'emprunt
		</div>
		<!-- Limit it to 4 -->
		<div v-for="res in reservation.slice(0, 4)" :key="res._id">
			<div class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
				<div class="divide-y divide-gray-100 dark:divide-gray-700">
					<a class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
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
									juqu'au :
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
		<a
			@click="approuvalRouter"
			class="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
		>
			<div class="inline-flex items-center">
				<svg
					class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
					<path
						fill-rule="evenodd"
						d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
						clip-rule="evenodd"
					/>
				</svg>
				Voir plus
			</div>
		</a>
	</div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useMaterialStore } from '@/store/modules/material.store';

const router = useRouter();
const materialStore = useMaterialStore();

function approuvalRouter() {
	router.push('/app/materials/approuvals');
}

defineProps({
	reservation: {
		type: Array,
		required: true,
	},
	users: {
		type: Array,
		required: true,
	},
});

function acceptReservation(materialID: string, borrowingID: string) {
	const payload = {
		borrowingID: borrowingID,
	};
	materialStore.acceptBorrowing(materialID, payload);
}

function declineReservation(materialID: string, borrowID: string) {
	const payload = {
		borrowingID: borrowID,
	};
	materialStore.declineBorrowing(materialID, payload);
}
</script>
