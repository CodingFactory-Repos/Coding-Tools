<template>
	<div>
		<button
			@click="openMetaModal"
			class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Créer une journée porte ouverte
		</button>
		<ModalOverlay v-if="showMetaModal" @close="closeMetaModal" size="lg">
			<template #body>
				<form @submit.prevent="addOpenHouses">
					<input
						type="text"
						name="title"
						v-model="title"
						placeholder="Title :"
						class="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
					/><br />
					<input
						type="datetime-local"
						v-model="date"
						class="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
					/><br />
					<input
						type="url"
						placeholder="picture link"
						v-model="picture"
						class="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
					/><br />
					<activity :Activities="Activities" class="mt-2 text-black" />
					<div>
						<input
							type="text"
							v-model="street"
							placeholder="street :"
							class="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
						/><br />
						<input
							type="text"
							v-model="zipCode"
							placeholder="zip code :"
							class="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
						/><br />
						<input
							type="text"
							v-model="town"
							placeholder="town :"
							class="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
						/><br />
					</div>
					<textarea
						placeholder="Description :"
						v-model="description"
						class="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
					></textarea
					><br />
					<participant
						:participants="participants"
						@clear="clearParticipants"
						class="mt-2 text-black"
					/>
					<input type="file" @change="onFileSelected" class="mt-2" /><br />
					<button
						type="submit"
						class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
					>
						Valider
					</button>
				</form>
			</template>
		</ModalOverlay>
	</div>
</template>

<script setup lang="ts">
import ModalOverlay from '@/components/common/Modal.vue';
import FormOpenHouse from './FormOpenHouses.vue';
import { useOpenHouseStore } from '@/store/modules/openHouse.store';
import { setgroups } from 'process';
import { ref } from 'vue';
import activity from './NewActivity.vue';
import participant from './NewParticipant.vue';
import { http } from '@/api/network/axios';

const openHouseStore = useOpenHouseStore();

const showMetaModal = ref(false);

const openMetaModal = () => (showMetaModal.value = true);
const closeMetaModal = () => (showMetaModal.value = false);

let title = '';
let date = '';
let street = '';
let zipCode = '';
let town = '';
let description = '';
let picture = '';
let participants = [];
let Activities = [];

const addOpenHouses = function () {
	let adress = {
		street: street,
		zipCode: zipCode,
		city: town,
	};
	http
		.post('/openhouses/create', {
			title: title,
			date: date,
			picture: picture,
			schedule: Activities,
			adress: adress,
			description: description,
			participants: participants,
		})
		.catch((error) => {
			console.log(error);
		});
	title = '';
	date = '';
	picture = '';
	street = '';
	zipCode = '';
	town = '';
	description = '';
	Activities = [];
	participants = [];
	closeMetaModal();
};

const onFileSelected = function (event) {
	console.log(event);
};

const clearParticipants = function () {
	participants.splice(0, participants.length);
};
//	 },

//}
</script>
